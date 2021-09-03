### What is this?
Stungun is a way of distributing data peer-to-peer using webrtc. 

#### Developer Journal
>   we need a way to carry information over through chains, 
    while not storing that data directly onto the Stungun instance.

    This way, we can do `stungun.get('key').put('value');
    and `.get('key')` doesn't get mutated for the next time we 
    want to use Stungun.

    This is the motivation for using ChainData

### Different Methodologies
I can see two possible design systems that would vary in difficulty/simplicity and performance. <br/>
Both methods involve every peer on the network being ultimately connected through a series of peers, but they differ in performance.

#### Application Targeted Grouping
Peers using the same application are more closely grouped together. This means that latency would be reduced when peers are talking to eachother over the same app, which is definitely the more likely scenario anyways. 

#### Global tree
Peers' positions in the tree are only determined by what will give them the best performance when communicating with any random peer on average. This is probably easier to implement, but I'm not sure how "real-time" things get when you have millions of peers connected. 

### Helpful articles
This blog post talks about some of the challenges with building a large-scale webrtc mesh network.<br/>
https://bloggeek.me/webrtc-p2p-mesh/

