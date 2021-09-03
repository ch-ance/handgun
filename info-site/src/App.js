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
        This lets us have mesh networks at a size of 5.
        <br/>
        Each node can have 10 total connections (5mb / 500kb), 5 to it's Higher mesh network, and 5 to its Lower mesh network.
        <br/>
        <SecondGraph />
        Now we have one mesh network in the middle, with each node forming its
        own mesh network.
        <br />
        Nodes 1-5 can talk to eachother through one data connection.
        <br />
        Node 6 can talk to node 1 through 1 data connection, nodes 2-5 through
        two data connections, and any other node through 3 data connections.
        <br />
        We can extrapolate this as much as we want.
        <br />
        I'm not very good at graph visualization, so I'm going to stop here.
        Just know that in this scenario, each power of 5 nodes (5, 25, 125, 625,
        etc) adds an additional hop that a node has to make to contact the
        furthest-away-from-it-node.
      </section>
      <section>
        <h2>In practice...</h2>
        Of course, not every node in a real application will have the exact same bandwidth limitations.
        <br/>
        So, we check each node's bandwidth upon connection.
        <br/>
        Each node can connect to n nodes, where n is uploadSpeed / desiredAppTransferSpeed.
        <br/>
        Each app will have different parameters, and desiredAppTransferSpeed is one of those parameters that must be configured for an Application Network*.
        <aside>*Application Network: Every peer connected to a particular Application.</aside>
      </section>
    </div>
  );
}

export default App;
