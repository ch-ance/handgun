import React from "react";
import { useReducer } from "react";
import { ReducerState } from "react";

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
