import React, { useEffect } from "react";
import { useReducer } from "react";
import { ReducerState } from "react";
import Stungun from "./stungun/dist";
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

  const stungun = new Stungun(process.env.REACT_APP_STUNGUN_API_KEY);

  useEffect(() => {
    (async () => {
      const data = await stungun.get("chat-messages").on((message: string) => {
        console.log(message);
      });

      console.log(data);
    })();
  }, []);
  return (
    <div>
      <h1>handgun messages</h1>
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
