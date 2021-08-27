### What is this?
Handgun is a way of distributing data peer-to-peer using webrtc. 

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

