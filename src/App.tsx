import React, { useEffect, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import Stungun from "./stungun/src";
type Message = {
  id: string;
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

const stungunOpts = {
  apiKey: process.env.REACT_APP_STUNGUN_API_KEY || "",
};

const stungun = new Stungun(stungunOpts);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [msgText, setMsgText] = useState("");

  useEffect(() => {
    // so that we can do async stuff in our useEffect
    (async () => {
      stungun.get("chat").on((msg) => {
        console.log("msg", msg);
        dispatch(msg);
      });
    })();
  }, []);

  const sendMessage = async () => {
    const message = { id: uuidv4(), body: msgText, from: "me" };
    stungun
      .get("chat")
      .set(message, (ack) => console.log("ack from set:", ack));
  };
  return (
    <div>
      <h1>handgun messages</h1>
      <input value={msgText} onChange={(e) => setMsgText(e.target.value)} />
      <button onClick={sendMessage}>send msg</button>
      <ul>
        {state.messages.map((msg) => {
          return (
            <li key={msg.id}>
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
