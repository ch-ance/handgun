import React, { useEffect, useState } from "react";
import { useReducer } from "react";
import Stungun from "./stungun/src";
type Message = {
  from: string;
  body: string;
};

const initialState: { messages: Message[] } = {
  messages: [],
};

const reducer = (state: { messages: Message[] }, message: Message) => {
  return {
    messages: [...state.messages, message],
  };
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [msgText, setMsgText] = useState("");
  const stungunOpts = {
    apiKey: process.env.REACT_APP_STUNGUN_API_KEY || "",
  };

  const stungun = new Stungun(stungunOpts);

  useEffect(() => {
    // so that we can do async stuff in our useEffect
    (async () => {
      stungun.get("chat-messages").once(console.log);
      stungun.get("chat-messages").put("heyey");
    })();
    //
  }, []);

  const sendMessage = async () => {};
  return (
    <div>
      <h1>handgun messages</h1>
      <input value={msgText} onChange={(e) => setMsgText(e.target.value)} />
      <button onClick={sendMessage}>send msg</button>
      <ul>
        {state.messages.map((msg) => {
          return (
            <li>
              <strong>{msg.from}</strong>
              <p>{msg.body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
