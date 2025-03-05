import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Client from '../components/Client';
import Editor from '../components/Editor'
import {language, cmtheme} from '../../src/atoms';
import {useRecoilState} from 'recoil';
import ACTIONS from '../actions/Actions';
import {initSocket} from '../socket';
import {useLocation, useNavigate, Navigate, useParams} from 'react-router-dom';

const EditorPage = () => {

    const [lang, setLang] = useRecoilState(language);
    const [them, setThem] = useRecoilState(cmtheme);

    const [clients, setClients] = useState([]);
    const [compilerOutput, setCompilerOutput] = useState("");

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const {roomId} = useParams();
    const reactNavigator = useNavigate();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({clients, username, socketId}) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({socketId, username}) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        };
    }, [location.state?.username, reactNavigator, roomId]);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }
 
    const compileCode = async (code, lang, input) => {
        // try {
        //     const response = await axios.post('http://localhost:5000/compile', {
        //         code,
        //         lang,
        //         input,
        //     }, {
        //         withCredentials: true
        //     });
        //     alert(response.data.output);
        // } catch (error) {
        //     console.error('Error:', error.response ? error.response.data : error.message);
        //     alert('An error occurred: ' + (error.response ? error.response.data : error.message));
        // }


        switch(lang) {
            case 'clike':
                lang = 'cpp'; 
                break;
            case 'javascript':
                lang = 'js'; 
                break;
            default:
                // Optionally handle other cases
                break;
        }

        const options = {
            method: 'POST',
            url: 'https://online-code-compiler.p.rapidapi.com/v1/',
            headers: {
                'x-rapidapi-key': '936e9ee82fmshb68bf453e860de7p1bef93jsnc55ed21ca742',
                'x-rapidapi-host': 'online-code-compiler.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                language: lang,
                version: 'latest',
                code: code,
                input: input
            }
        };
    
        try {
            const response = await axios.request(options);
            if (response.status === 200) { 
                console.log(response.data.output);
                const formattedOutput = response.data.output.replace(/\n/g, '<br/>');
                setCompilerOutput(formattedOutput);
            }
            else {
                setCompilerOutput({ error: 'An error occurred while compiling the code.' });
                alert("An error occurred while compiling the code.")

            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while compiling the code.")
            setCompilerOutput({ error: 'An error occurred while compiling the code.' });
        }


    };

    if (!location.state) {
        return <Navigate to="/" />;
    }

    // Function to decode HTML entities
    const decodeHtml = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    // Your component that uses the decodeHtml function
    const CompilerOutput = ({ output }) => {
        // Decode output before setting it
        const formattedOutput = decodeHtml(output);

        return (
            <div 
                className="compiler-output" 
                dangerouslySetInnerHTML={{ __html: formattedOutput }} 
            />
        );
    };


    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img
                            className="logoImage"
                            src="/logo.png"
                            alt="logo"
                        />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>

                <label>
                    Select Language:
                    <select value={lang} onChange={(e) => { setLang(e.target.value); window.location.reload(); }} className="seLang">
                        <option value="cpp">C / C++ </option>
                        <option value="java">Java </option>
                        <option value="css">CSS</option>
                        <option value="dart">Dart</option>
                        <option value="django">Django</option>
                        <option value="dockerfile">Dockerfile</option>
                        <option value="go">Go</option>
                        <option value="htmlmixed">HTML-mixed</option>
                        <option value="javascript">JavaScript</option>
                        <option value="jsx">JSX</option>
                        <option value="markdown">Markdown</option>
                        <option value="php">PHP</option>
                        <option value="python3">Python</option>
                        <option value="r">R</option>
                        <option value="rust">Rust</option>
                        <option value="ruby">Ruby</option>
                        <option value="sass">Sass</option>
                        <option value="shell">Shell</option>
                        <option value="sql">SQL</option>
                        <option value="swift">Swift</option>
                        <option value="xml">XML</option>
                        <option value="yaml">yaml</option>
                    </select>
                </label>

                <label>
                    Select Theme:
                    <select value={them} onChange={(e) => {setThem(e.target.value); window.location.reload();}} className="seLang">
                        <option value="default">default</option>
                        <option value="3024-day">3024-day</option>
                        <option value="3024-night">3024-night</option>
                        <option value="abbott">abbott</option>
                        <option value="abcdef">abcdef</option>
                        <option value="ambiance">ambiance</option>
                        <option value="ayu-dark">ayu-dark</option>
                        <option value="ayu-mirage">ayu-mirage</option>
                        <option value="base16-dark">base16-dark</option>
                        <option value="base16-light">base16-light</option>
                        <option value="bespin">bespin</option>
                        <option value="blackboard">blackboard</option>
                        <option value="cobalt">cobalt</option>
                        <option value="colorforth">colorforth</option>
                        <option value="darcula">darcula</option>
                        <option value="duotone-dark">duotone-dark</option>
                        <option value="duotone-light">duotone-light</option>
                        <option value="eclipse">eclipse</option>
                        <option value="elegant">elegant</option>
                        <option value="erlang-dark">erlang-dark</option>
                        <option value="gruvbox-dark">gruvbox-dark</option>
                        <option value="hopscotch">hopscotch</option>
                        <option value="icecoder">icecoder</option>
                        <option value="idea">idea</option>
                        <option value="isotope">isotope</option>
                        <option value="juejin">juejin</option>
                        <option value="lesser-dark">lesser-dark</option>
                        <option value="liquibyte">liquibyte</option>
                        <option value="lucario">lucario</option>
                        <option value="material">material</option>
                        <option value="material-darker">material-darker</option>
                        <option value="material-palenight">material-palenight</option>
                        <option value="material-ocean">material-ocean</option>
                        <option value="mbo">mbo</option>
                        <option value="mdn-like">mdn-like</option>
                        <option value="midnight">midnight</option>
                        <option value="monokai">monokai</option>
                        <option value="moxer">moxer</option>
                        <option value="neat">neat</option>
                        <option value="neo">neo</option>
                        <option value="night">night</option>
                        <option value="nord">nord</option>
                        <option value="oceanic-next">oceanic-next</option>
                        <option value="panda-syntax">panda-syntax</option>
                        <option value="paraiso-dark">paraiso-dark</option>
                        <option value="paraiso-light">paraiso-light</option>
                        <option value="pastel-on-dark">pastel-on-dark</option>
                        <option value="railscasts">railscasts</option>
                        <option value="rubyblue">rubyblue</option>
                        <option value="seti">seti</option>
                        <option value="shadowfox">shadowfox</option>
                        <option value="solarized">solarized</option>
                        <option value="the-matrix">the-matrix</option>
                        <option value="tomorrow-night-bright">tomorrow-night-bright</option>
                        <option value="tomorrow-night-eighties">tomorrow-night-eighties</option>
                        <option value="ttcn">ttcn</option>
                        <option value="twilight">twilight</option>
                        <option value="vibrant-ink">vibrant-ink</option>
                        <option value="xq-dark">xq-dark</option>
                        <option value="xq-light">xq-light</option>
                        <option value="yeti">yeti</option>
                        <option value="yonce">yonce</option>
                        <option value="zenburn">zenburn</option>
                    </select>
                </label>

                <button className="btn copyBtn" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>
            </div>

            <div className="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />

            </div>
                <div className="compilearea">

                <button className="btn compilebtn" onClick={() => compileCode(codeRef.current, lang)}>Compile</button>
                <CompilerOutput output={compilerOutput} />
            </div>
        </div>
    );
}

export default EditorPage;