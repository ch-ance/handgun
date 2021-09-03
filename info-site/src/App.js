import logo from "./logo.svg";
import "./App.css";
import FirstGraph from "./graphs/firstGraph";
import SecondGraph from "./graphs/secondGraph";

function App() {
  return (
    <div className="app">
      <header>
        <h1>Stungun</h1>
      </header>
      <section>
        <h2>Goals</h2>
        We want to store data in a decentralized manner.
        <br /> We want to avoid single points of failure.
        <br /> We want to connect many Peers* together for real-time
        communication, i.e. data syncing.
        <aside>
          *Peer: A node on the network. They are usually connected to other
          peers using the same Application, and are usually running on a
          browser.
        </aside>
      </section>
      <section>
        <h2>In a perfect world...</h2>
        Ideally, we would just connect every peer to eachother, add in some
        conflict resolution mechanism, and let peers subscribe to the data they
        want to receive and/or update.
        <br />
        Let’s see what this might look like with a network of 20 peers all using
        the same Application.
        <br /> Each blue circle represents a single client, or Peer, and the
        lines between them represent data channels.
        <FirstGraph />
      </section>
      <section>
        Pretty cool, huh? Every Peer is connected to every other Peer.
        <br />
        With a network like this, we could transmit data to everyone almost
        instantaneously.
        <br />
        Each Peer could store the data that is relevant to them, give it to any
        Peer that asks for it, and we would have a beautiful peer-to-peer
        database.
      </section>
      <section>
        <h2>But... WebRTC isn't very nice</h2>
        WebRTC is the technology that lets us talk browser-to-browser without an
        intermediary.
        <br />
        It's great, but it has some severe limitations.
        <br />
        The most important limitation as it pertains to us, is that you can only
        have a small number of active concurrent connections.
        <br />
        The browser limits this number to around 250 or 500 depending on your
        browser, but in practice you can't actually even use this many.
        <br />
        Depending on how much data you want to throughput at any given time,
        you're going to start having problems if you try to connect more than 10
        or so browsers together like this.
        <br />
        If you're talking about something like video streaming, you can only
        reliably have about 5 concurrent clients connected.
      </section>
      <section>
        <h2>Solution: Multiple inter-connected networks</h2>
        To get around the WebRTC connection limitation, we're going to make a
        bunch of smaller WebRTC mesh networks and connect them together.
        <br />
        To demonstrate this, let's first establish some parameters for our
        network.
        <br />
        We'll assume that each Peer has approximately 5mb/s upload bandwidth,
        and that our application requires up to 500kb/s for real-time
        communications.
        <br />
        <SecondGraph />
        Now we have one mesh network in the middle, with each node forming its
        own mesh network.
      </section>
    </div>
  );
}

export default App;
