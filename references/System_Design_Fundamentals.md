# System Design Fundamentals: The Core Knowledge Behind High-Level Design

> A study guide for building the vocabulary, mental models, and principles you need to understand (and eventually produce) high-level system designs.
>
> Written for a full-stack TypeScript engineer preparing for mid/senior interviews at large tech companies.

---

## How to Use This Guide

This is **not a cheat sheet**. It is a textbook-style guide meant to be read in order the first time, then used as a reference.

The parts build on each other:

1. **Foundations** — what a "system" is and what happens when you open a web page.
2. **Networking** — IP, TCP, UDP, DNS, TLS, HTTP/1.1/2/3, WebSockets, SSE, and friends.
3. **APIs** — REST, GraphQL, gRPC, API design, authentication.
4. **Measuring systems** — latency, throughput, availability, SLI/SLO/SLA.
5. **Back-of-the-envelope estimation** — how to calculate storage, RAM, bandwidth, QPS, and servers.
6. **Core building blocks** — proxies, reverse proxies, load balancers, API gateways, CDNs.
7. **Caching** — where, how, and what can go wrong.
8. **Databases** — every major type, how they store data, indexes, transactions, and how to choose one.
9. **Scaling data** — replication, sharding, consistent hashing.
10. **Distributed systems theory** — CAP, consistency models, quorums, consensus, distributed transactions, clocks, IDs.
11. **Asynchronous processing** — queues, pub/sub, streams, event-driven design.
12. **Architecture styles** — monoliths, microservices, serverless.
13. **Reliability and resilience** — retries, circuit breakers, rate limiting, failover, disaster recovery.
14. **Specialized data structures** — Bloom filters, HyperLogLog, geohashes, tries, and more.
15. **Common design patterns** — feeds, uploads, counters, contention, real-time updates.
16. **Security** — authentication, authorization, encryption, common attacks.
17. **Observability** — logs, metrics, traces, alerting.
18. **Cloud and infrastructure** — regions, containers, Kubernetes, deployments, cloud service map.
19. **The interview framework** — how all of this is used in an interview, with a full worked example.
20. **Glossary** — every term in one place.

**A reading tip:** each section ends with a short "Key takeaways" list. If you can explain each takeaway out loud in your own words, you understand the section.


---

## Table of Contents

- [Part 1: Foundations](#part-1-foundations)
  - [1.1 What Is "System Design"?](#11-what-is-system-design)
  - [1.2 The Central Idea: Everything Is a Trade-off](#12-the-central-idea-everything-is-a-trade-off)
  - [1.3 The Client-Server Model](#13-the-client-server-model)
  - [1.4 What Happens When You Type a URL and Press Enter?](#14-what-happens-when-you-type-a-url-and-press-enter)
- [Part 2: Networking Fundamentals](#part-2-networking-fundamentals)
  - [2.1 Layered Models: OSI and TCP/IP](#21-layered-models-osi-and-tcpip)
  - [2.2 IP: Internet Protocol](#22-ip-internet-protocol)
  - [2.3 TCP: Transmission Control Protocol](#23-tcp-transmission-control-protocol)
  - [2.4 UDP: User Datagram Protocol](#24-udp-user-datagram-protocol)
  - [2.5 DNS: Domain Name System](#25-dns-domain-name-system)
  - [2.6 TLS and HTTPS: Encryption on the Wire](#26-tls-and-https-encryption-on-the-wire)
  - [2.7 HTTP: HyperText Transfer Protocol](#27-http-hypertext-transfer-protocol)
  - [2.8 HTTP Versions: 1.0, 1.1, 2, and 3](#28-http-versions-10-11-2-and-3)
  - [2.9 Real-Time Communication: Polling, Long Polling, SSE, WebSockets, WebRTC, Webhooks](#29-real-time-communication-polling-long-polling-sse-websockets-webrtc-webhooks)
- [Part 3: APIs — How Components Talk](#part-3-apis--how-components-talk)
  - [3.1 REST: Representational State Transfer](#31-rest-representational-state-transfer)
  - [3.2 GraphQL](#32-graphql)
  - [3.3 gRPC](#33-grpc)
  - [3.4 Other API Styles You Should Recognize](#34-other-api-styles-you-should-recognize)
  - [3.5 Choosing an API Style](#35-choosing-an-api-style)
  - [3.6 API Design Essentials](#36-api-design-essentials)
  - [3.7 Authentication and Authorization for APIs](#37-authentication-and-authorization-for-apis)
- [Part 4: Measuring Systems — Performance and Reliability Vocabulary](#part-4-measuring-systems--performance-and-reliability-vocabulary)
  - [4.1 Latency, Throughput, and Bandwidth](#41-latency-throughput-and-bandwidth)
  - [4.2 Percentiles: p50, p95, p99](#42-percentiles-p50-p95-p99)
  - [4.3 Availability and "the Nines"](#43-availability-and-the-nines)
  - [4.4 SLI, SLO, SLA, and Error Budgets](#44-sli-slo-sla-and-error-budgets)
  - [4.5 Durability, RPO, and RTO](#45-durability-rpo-and-rto)
  - [4.6 Scalability, Elasticity, and Other "-ilities"](#46-scalability-elasticity-and-other--ilities)
- [Part 5: Back-of-the-Envelope Estimation](#part-5-back-of-the-envelope-estimation)
  - [5.1 Why Estimate at All?](#51-why-estimate-at-all)
  - [5.2 Numbers You Should Know](#52-numbers-you-should-know)
  - [5.3 The Estimation Recipe](#53-the-estimation-recipe)
  - [5.4 Worked Example: A Twitter-like Service](#54-worked-example-a-twitter-like-service)
  - [5.5 More Quick Examples](#55-more-quick-examples)
  - [5.6 Estimation Tips](#56-estimation-tips)
- [Part 6: Core Building Blocks — Scaling the Request Path](#part-6-core-building-blocks--scaling-the-request-path)
  - [6.1 Vertical vs Horizontal Scaling](#61-vertical-vs-horizontal-scaling)
  - [6.2 Stateless vs Stateful Services](#62-stateless-vs-stateful-services)
  - [6.3 Proxies: Forward Proxy vs Reverse Proxy](#63-proxies-forward-proxy-vs-reverse-proxy)
  - [6.4 Load Balancers](#64-load-balancers)
  - [6.5 API Gateway](#65-api-gateway)
  - [6.6 CDN: Content Delivery Network](#66-cdn-content-delivery-network)
- [Part 7: Caching](#part-7-caching)
  - [7.1 Why Cache?](#71-why-cache)
  - [7.2 Where Caches Live](#72-where-caches-live)
  - [7.3 Caching Strategies (Read and Write Patterns)](#73-caching-strategies-read-and-write-patterns)
  - [7.4 Eviction Policies](#74-eviction-policies)
  - [7.5 Cache Invalidation and Consistency](#75-cache-invalidation-and-consistency)
  - [7.6 Classic Caching Problems](#76-classic-caching-problems)
  - [7.7 Redis vs Memcached](#77-redis-vs-memcached)
- [Part 8: Databases and Storage](#part-8-databases-and-storage)
  - [8.1 The Big Picture: Kinds of Storage](#81-the-big-picture-kinds-of-storage)
  - [8.2 Relational Databases (RDBMS)](#82-relational-databases-rdbms)
  - [8.3 Transactions in Depth: Isolation Levels and Concurrency Control](#83-transactions-in-depth-isolation-levels-and-concurrency-control)
  - [8.4 Key-Value Stores](#84-key-value-stores)
  - [8.5 Document Databases](#85-document-databases)
  - [8.6 Wide-Column Stores](#86-wide-column-stores)
  - [8.7 Graph Databases](#87-graph-databases)
  - [8.8 Time-Series Databases](#88-time-series-databases)
  - [8.9 Search Engines](#89-search-engines)
  - [8.10 OLTP vs OLAP: Analytical Databases and Data Warehouses](#810-oltp-vs-olap-analytical-databases-and-data-warehouses)
  - [8.11 Object (Blob) Storage](#811-object-blob-storage)
  - [8.12 Vector Databases](#812-vector-databases)
  - [8.13 How Databases Store Data: B-Trees vs LSM Trees](#813-how-databases-store-data-b-trees-vs-lsm-trees)
  - [8.14 Indexes](#814-indexes)
  - [8.15 How to Choose a Database](#815-how-to-choose-a-database)
- [Part 9: Scaling Data — Replication, Partitioning, and Consistent Hashing](#part-9-scaling-data--replication-partitioning-and-consistent-hashing)
  - [9.1 Replication](#91-replication)
  - [9.2 Partitioning (Sharding)](#92-partitioning-sharding)
  - [9.3 Other Data-Scaling Techniques](#93-other-data-scaling-techniques)
  - [9.4 Consistent Hashing](#94-consistent-hashing)
- [Part 10: Distributed Systems Theory](#part-10-distributed-systems-theory)
  - [10.1 Why Distributed Systems Are Hard](#101-why-distributed-systems-are-hard)
  - [10.2 The CAP Theorem](#102-the-cap-theorem)
  - [10.3 Consistency Models](#103-consistency-models)
  - [10.4 Quorums: Tunable Consistency](#104-quorums-tunable-consistency)
  - [10.5 Consensus and Leader Election](#105-consensus-and-leader-election)
  - [10.6 Time and Ordering](#106-time-and-ordering)
  - [10.7 Distributed Transactions: 2PC and Sagas](#107-distributed-transactions-2pc-and-sagas)
  - [10.8 Delivery Guarantees and Idempotency](#108-delivery-guarantees-and-idempotency)
  - [10.9 Generating Unique IDs at Scale](#109-generating-unique-ids-at-scale)
  - [10.10 Failure Detection, Heartbeats, and Gossip](#1010-failure-detection-heartbeats-and-gossip)
- [Part 11: Asynchronous Processing — Queues, Pub/Sub, and Streams](#part-11-asynchronous-processing--queues-pubsub-and-streams)
  - [11.1 Synchronous vs Asynchronous Communication](#111-synchronous-vs-asynchronous-communication)
  - [11.2 Message Queues (Point-to-Point)](#112-message-queues-point-to-point)
  - [11.3 Publish/Subscribe (Pub/Sub)](#113-publishsubscribe-pubsub)
  - [11.4 Event Streams and Logs (Kafka)](#114-event-streams-and-logs-kafka)
  - [11.5 Operational Concerns with Messaging](#115-operational-concerns-with-messaging)
  - [11.6 Event-Driven Architecture](#116-event-driven-architecture)
  - [11.7 The Dual-Write Problem, the Outbox Pattern, and CDC](#117-the-dual-write-problem-the-outbox-pattern-and-cdc)
  - [11.8 CQRS and Event Sourcing](#118-cqrs-and-event-sourcing)
  - [11.9 Batch vs Stream Processing](#119-batch-vs-stream-processing)
  - [11.10 Background Jobs, Scheduling, and Workflows](#1110-background-jobs-scheduling-and-workflows)
- [Part 12: Architecture Styles](#part-12-architecture-styles)
  - [12.1 Monolith](#121-monolith)
  - [12.2 Modular Monolith](#122-modular-monolith)
  - [12.3 Microservices](#123-microservices)
  - [12.4 Service Discovery](#124-service-discovery)
  - [12.5 Service Mesh and Sidecars](#125-service-mesh-and-sidecars)
  - [12.6 Serverless](#126-serverless)
  - [12.7 Comparison and Migration](#127-comparison-and-migration)
- [Part 13: Reliability and Resilience Patterns](#part-13-reliability-and-resilience-patterns)
  - [13.1 Kinds of Failures](#131-kinds-of-failures)
  - [13.2 Redundancy and Failover](#132-redundancy-and-failover)
  - [13.3 Timeouts](#133-timeouts)
  - [13.4 Retries with Exponential Backoff and Jitter](#134-retries-with-exponential-backoff-and-jitter)
  - [13.5 Circuit Breaker and Bulkhead](#135-circuit-breaker-and-bulkhead)
  - [13.6 Rate Limiting](#136-rate-limiting)
  - [13.7 Load Shedding, Backpressure, and Graceful Degradation](#137-load-shedding-backpressure-and-graceful-degradation)
  - [13.8 Multi-AZ and Multi-Region Architecture](#138-multi-az-and-multi-region-architecture)
  - [13.9 Disaster Recovery Strategies](#139-disaster-recovery-strategies)
  - [13.10 Health Checks and Chaos Engineering](#1310-health-checks-and-chaos-engineering)
- [Part 14: Specialized Data Structures for Scale](#part-14-specialized-data-structures-for-scale)
  - [14.1 Bloom Filter — "Have I Seen This Before?"](#141-bloom-filter--have-i-seen-this-before)
  - [14.2 Count-Min Sketch — "Roughly How Many Times?"](#142-count-min-sketch--roughly-how-many-times)
  - [14.3 HyperLogLog — "Roughly How Many Unique?"](#143-hyperloglog--roughly-how-many-unique)
  - [14.4 Geospatial Indexing — "What's Near Me?"](#144-geospatial-indexing--whats-near-me)
  - [14.5 Trie — Autocomplete](#145-trie--autocomplete)
  - [14.6 Inverted Index — Full-Text Search](#146-inverted-index--full-text-search)
  - [14.7 Skip Lists, Heaps, and Leaderboards](#147-skip-lists-heaps-and-leaderboards)
  - [14.8 Merkle Tree — Comparing Large Datasets Efficiently](#148-merkle-tree--comparing-large-datasets-efficiently)
  - [14.9 Summary](#149-summary)
- [Part 15: Common Design Patterns and Problem-Solving Techniques](#part-15-common-design-patterns-and-problem-solving-techniques)
  - [15.1 News Feeds: Fan-out on Write vs Fan-out on Read](#151-news-feeds-fan-out-on-write-vs-fan-out-on-read)
  - [15.2 Video Streaming and Adaptive Bitrate](#152-video-streaming-and-adaptive-bitrate)
  - [15.3 Large File Uploads: Presigned URLs and Multipart Uploads](#153-large-file-uploads-presigned-urls-and-multipart-uploads)
  - [15.4 Counting at Scale: Likes, Views, and Counters](#154-counting-at-scale-likes-views-and-counters)
  - [15.5 High Contention: Bookings, Flash Sales, and Inventory](#155-high-contention-bookings-flash-sales-and-inventory)
  - [15.6 Real-Time Updates End to End](#156-real-time-updates-end-to-end)
  - [15.7 Proximity Services: Nearby Places and Moving Objects](#157-proximity-services-nearby-places-and-moving-objects)
  - [15.8 Leaderboards and Top-K](#158-leaderboards-and-top-k)
  - [15.9 Search and Typeahead](#159-search-and-typeahead)
  - [15.10 Long-Running Operations](#1510-long-running-operations)
  - [15.11 Scaling Reads vs Scaling Writes: A Checklist](#1511-scaling-reads-vs-scaling-writes-a-checklist)
- [Part 16: Security Fundamentals](#part-16-security-fundamentals)
  - [16.1 Authentication and Authorization Recap](#161-authentication-and-authorization-recap)
  - [16.2 Encryption](#162-encryption)
  - [16.3 Hashing and Password Storage](#163-hashing-and-password-storage)
  - [16.4 Secrets Management](#164-secrets-management)
  - [16.5 Network Security](#165-network-security)
  - [16.6 Common Attacks and Defenses](#166-common-attacks-and-defenses)
  - [16.7 Privacy and Compliance](#167-privacy-and-compliance)
- [Part 17: Observability and Monitoring](#part-17-observability-and-monitoring)
  - [17.1 The Three Pillars: Logs, Metrics, Traces](#171-the-three-pillars-logs-metrics-traces)
  - [17.2 Alerting](#172-alerting)
  - [17.3 Dashboards and Other Signals](#173-dashboards-and-other-signals)
- [Part 18: Cloud and Infrastructure Fundamentals](#part-18-cloud-and-infrastructure-fundamentals)
  - [18.1 Regions, Availability Zones, and Edge Locations](#181-regions-availability-zones-and-edge-locations)
  - [18.2 Compute Models](#182-compute-models)
  - [18.3 Containers and Docker](#183-containers-and-docker)
  - [18.4 Kubernetes Basics](#184-kubernetes-basics)
  - [18.5 Autoscaling](#185-autoscaling)
  - [18.6 Infrastructure as Code, CI/CD, and Deployments](#186-infrastructure-as-code-cicd-and-deployments)
  - [18.7 Cloud Service Map](#187-cloud-service-map)
- [Part 19: Putting It All Together — The System Design Interview](#part-19-putting-it-all-together--the-system-design-interview)
  - [19.1 What Interviewers Evaluate](#191-what-interviewers-evaluate)
  - [19.2 A Step-by-Step Framework](#192-a-step-by-step-framework)
  - [19.3 Useful Phrases for Trade-off Discussions](#193-useful-phrases-for-trade-off-discussions)
  - [19.4 Worked Example: Design a URL Shortener (like bit.ly)](#194-worked-example-design-a-url-shortener-like-bitly)
  - [19.5 Classic Problems and the Concepts They Test](#195-classic-problems-and-the-concepts-they-test)
- [Part 20: Glossary](#part-20-glossary)
- [Final Words](#final-words)

---

## Part 1: Foundations

### 1.1 What Is "System Design"?

**Software system design** is the process of deciding how the pieces of a software system fit together so that it meets its goals: correct behavior, speed, cost, reliability, and ability to grow.

There are two common levels:

| Level | Also called | What it answers | Example question |
|---|---|---|---|
| **High-Level Design (HLD)** | Architecture, "system design" | Which components exist and how they talk to each other | "Design Twitter" |
| **Low-Level Design (LLD)** | Object-oriented design, "machine coding" | Which classes, interfaces, and methods exist inside one component | "Design a parking lot class model" |

This guide is about **HLD**. In an HLD interview you draw boxes (clients, servers, databases, caches, queues) and arrows (network calls), and you justify every choice.

### 1.2 The Central Idea: Everything Is a Trade-off

There is almost never a "correct" design. There are designs that make **reasonable trade-offs** given the requirements. The interviewer is mostly checking whether you:

- know the options,
- know the cost of each option,
- pick an option that fits the stated requirements, and
- can explain *why*.

Examples of trade-offs you will see throughout this guide:

| You gain... | ...but you pay with |
|---|---|
| Speed from caching | Stale (outdated) data, extra complexity |
| Availability from replication | Consistency problems, extra cost |
| Scale from sharding | Complex queries, cross-shard transactions |
| Decoupling from message queues | Eventual consistency, harder debugging |
| Flexibility from microservices | Network overhead, operational complexity |

Keep this table in your mind. Almost every section below is an elaboration of one of its rows.

### 1.3 The Client-Server Model

Nearly every system you will design starts with the **client-server model**:

- A **client** is a program that asks for something: a browser, a mobile app, another backend service.
- A **server** is a program that listens for requests and answers them.

```mermaid
flowchart LR
    C["Client: browser or mobile app"] -->|"request"| S["Server"]
    S -->|"response"| C
    S --> D[("Database")]
```

A single machine can be both: your backend service is a server for the mobile app and a client of the database.

### 1.4 What Happens When You Type a URL and Press Enter?

This classic question is the perfect map for the next few parts, because it touches almost every networking concept. Here is the journey of `https://www.example.com/products`:

```mermaid
sequenceDiagram
    participant B as Browser
    participant DNS as DNS Resolver
    participant CDN as CDN or Load Balancer
    participant App as App Server
    participant DB as Database

    B->>DNS: What is the IP of www.example.com?
    DNS-->>B: 93.184.216.34
    B->>CDN: TCP handshake, then TLS handshake
    B->>CDN: HTTP GET /products
    CDN->>App: Forward request
    App->>DB: SELECT products
    DB-->>App: Rows
    App-->>CDN: HTTP 200 with HTML or JSON
    CDN-->>B: HTTP 200 response
    B->>B: Render page, fetch CSS, JS, images
```

Step by step:

1. **URL parsing** — the browser splits the URL into scheme (`https`), host (`www.example.com`), and path (`/products`).
2. **DNS lookup** — the browser needs an **IP address** (a numeric address for a machine). It asks the **Domain Name System (DNS)** to translate the name into an IP. (Section 2.5)
3. **TCP connection** — the browser opens a reliable connection to that IP on port 443 using the **Transmission Control Protocol (TCP)**. (Section 2.3)
4. **TLS handshake** — because the scheme is `https`, browser and server set up encryption using **Transport Layer Security (TLS)**. (Section 2.6)
5. **HTTP request** — the browser sends an **HTTP (HyperText Transfer Protocol)** request: `GET /products`. (Section 2.7)
6. **Server side** — the request usually hits a **load balancer** or **CDN (Content Delivery Network)** first, then an application server, which may query a cache and a database. (Parts 6–8)
7. **HTTP response** — the server returns a status code (like `200 OK`) and a body (HTML or JSON).
8. **Rendering** — the browser parses HTML, then makes more requests for CSS, JavaScript, and images.

Now let's go through each layer properly.

**Key takeaways**
- HLD = components and how they communicate; LLD = classes inside one component.
- Every design decision is a trade-off; your job is to name the trade-off.
- A single web request touches DNS, TCP, TLS, HTTP, load balancers, servers, caches, and databases.

---

## Part 2: Networking Fundamentals

### 2.1 Layered Models: OSI and TCP/IP

Networking is organized in **layers**. Each layer solves one problem and relies on the layer below it. You don't need to memorize every layer, but you must know the ones that come up in design discussions.

The **OSI (Open Systems Interconnection) model** has 7 layers. The practical **TCP/IP model** collapses them into 4. Here are the ones that matter:

| OSI layer | Name | What it does | Examples | Why you care in system design |
|---|---|---|---|---|
| 7 | Application | The data your app understands | HTTP, gRPC, WebSocket, DNS, SMTP | "Layer 7 load balancer" routes by URL, headers, cookies |
| 6 | Presentation | Encoding, encryption | TLS (roughly), JSON, Protobuf | Encryption, serialization formats |
| 5 | Session | Session management | (rarely discussed separately) | — |
| 4 | Transport | Process-to-process delivery, ports | TCP, UDP, QUIC | "Layer 4 load balancer" routes by IP and port only |
| 3 | Network | Machine-to-machine delivery across networks | IP (Internet Protocol) | IP addresses, routing, subnets |
| 2 | Data link | Delivery on the local network | Ethernet, Wi-Fi, MAC addresses | Rarely in HLD |
| 1 | Physical | Bits on wire or radio | Cables, fiber | Rarely in HLD |

**Mental model — sending a letter:**

- **Application layer (L7)** = the content of the letter ("please send me the product list").
- **Transport layer (L4)** = the department inside the building (the **port**), and the promise that pages arrive in order (TCP) or not (UDP).
- **Network layer (L3)** = the building address (the **IP address**) and the postal routing between cities.
- **Lower layers** = the trucks and roads.

Each layer **wraps** the data of the layer above it (called **encapsulation**):

```
+-----------------------------------------------------------+
| Ethernet header | IP header | TCP header | HTTP data      |
+-----------------------------------------------------------+
      L2              L3          L4          L7
```

The phrases **"L4"** and **"L7"** appear constantly in system design (especially for load balancers), so remember: **L4 = TCP/UDP level (IP + port), L7 = application level (HTTP URL, headers, cookies).**

### 2.2 IP: Internet Protocol

**IP (Internet Protocol)** gives every machine on a network an address and routes **packets** (small chunks of data) between machines. IP is **best effort**: packets can be lost, duplicated, or arrive out of order. Reliability is added by higher layers (TCP).

#### IPv4 vs IPv6

| | IPv4 | IPv6 |
|---|---|---|
| Size | 32 bits | 128 bits |
| Example | `192.168.1.10` | `2001:0db8:85a3::8a2e:0370:7334` |
| Number of addresses | ~4.3 billion (2^32) | ~3.4 × 10^38 (2^128) |
| Status | Addresses exhausted; extended with NAT | Growing adoption |

#### Public vs private IPs and NAT

Because IPv4 addresses ran out, most devices use **private IP addresses** that are valid only inside a local network. These ranges are reserved for private use:

- `10.0.0.0/8`
- `172.16.0.0/12`
- `192.168.0.0/16`

**NAT (Network Address Translation)** lets many private devices share one public IP. Your home router does this: your laptop is `192.168.1.10` internally, but the internet sees your router's public IP.

In cloud design, your databases and internal services live in **private subnets** (private IPs, not reachable from the internet), and only load balancers or gateways have public IPs. This is a basic security principle.

#### CIDR notation

**CIDR (Classless Inter-Domain Routing)** notation describes a range of IPs: `10.0.0.0/16` means "the first 16 bits are fixed", leaving 16 bits for hosts = 65,536 addresses. `/24` leaves 8 bits = 256 addresses. You'll see this when people talk about **VPCs (Virtual Private Clouds)** and subnets.

#### Ports

An IP address identifies a **machine**; a **port** (a number from 0 to 65,535) identifies a **process** on that machine. The pair `IP:port` (for example `10.0.1.5:5432`) is called a **socket address**.

Common ports worth recognizing:

| Port | Service |
|---|---|
| 22 | SSH (Secure Shell) |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 9092 | Kafka |
| 27017 | MongoDB |

### 2.3 TCP: Transmission Control Protocol

**TCP** is a **connection-oriented, reliable** transport protocol. It guarantees that bytes arrive **in order, without loss, without duplication** — or that you get an error.

#### The three-way handshake (opening a connection)

Before sending data, client and server exchange three messages:

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    C->>S: SYN - I want to connect, my sequence number is x
    S-->>C: SYN-ACK - OK, got x, my sequence number is y
    C->>S: ACK - got y
    Note over C,S: Connection established, data can flow
```

- **SYN** = synchronize, **ACK** = acknowledge.
- Cost: **1 round trip (1 RTT)** before any data is sent. **RTT (Round-Trip Time)** is the time for a message to go to the other side and back.

This matters for performance: if client and server are 100 ms apart, simply opening a TCP connection costs 100 ms. That's why we **reuse connections** (keep-alive, connection pooling) and put servers close to users (CDNs).

#### How TCP achieves reliability

| Mechanism | What it does | Analogy |
|---|---|---|
| **Sequence numbers** | Every byte is numbered so the receiver can reorder | Page numbers on a letter |
| **Acknowledgments (ACKs)** | Receiver confirms what it got | "Got pages 1–5" |
| **Retransmission** | Sender resends data not acknowledged in time | Resend lost pages |
| **Flow control** | Receiver says how much it can accept (receive window) | "Don't send more than 10 pages at once; my desk is full" |
| **Congestion control** | Sender slows down when the network is overloaded (for example "slow start") | Drive slower in traffic |

Closing a connection uses a four-step exchange (FIN, ACK, FIN, ACK). You rarely need details, but know that connections have setup and teardown cost.

#### Head-of-line blocking in TCP

Because TCP delivers bytes **strictly in order**, if one packet is lost, all packets after it wait until the lost one is retransmitted — even if they belong to unrelated requests. This is **head-of-line (HOL) blocking**, and it's the key reason HTTP/3 moved away from TCP (Section 2.8).

### 2.4 UDP: User Datagram Protocol

**UDP** is the minimalist alternative: **connectionless, unreliable, unordered**. You just send **datagrams** (independent packets). No handshake, no retransmission, no ordering.

Why would anyone want that? Because sometimes **late data is worse than lost data**:

- **Video calls and voice (VoIP)** — a frame that arrives 2 seconds late is useless; skip it.
- **Online games** — only the latest player position matters.
- **DNS lookups** — tiny request/response; if lost, just ask again.
- **Live streaming** and **QUIC/HTTP/3** — which builds its own reliability on top of UDP.

#### TCP vs UDP

| | TCP | UDP |
|---|---|---|
| Connection | Yes (handshake) | No |
| Reliability | Guaranteed delivery, retransmits | None |
| Ordering | Guaranteed | None |
| Overhead | Higher (headers, ACKs, handshake) | Lower |
| Speed / latency | Slower to start, can stall on loss | Fast, no stalls |
| Use cases | Web (HTTP/1.1, HTTP/2), APIs, databases, file transfer, email | Video/voice calls, gaming, DNS, QUIC (HTTP/3) |

**Rule of thumb:** use TCP unless you have a specific real-time reason where freshness matters more than completeness.

### 2.5 DNS: Domain Name System

Humans remember `google.com`; networks need IP addresses. **DNS** is the internet's distributed "phone book" that maps names to IPs.

#### How a DNS lookup works

```mermaid
sequenceDiagram
    participant B as Browser or OS cache
    participant R as Recursive Resolver - ISP or 8.8.8.8
    participant Root as Root Server
    participant TLD as TLD Server - .com
    participant Auth as Authoritative Server - example.com

    B->>R: IP for www.example.com?
    R->>Root: www.example.com?
    Root-->>R: Ask the .com TLD servers
    R->>TLD: www.example.com?
    TLD-->>R: Ask example.com's authoritative servers
    R->>Auth: www.example.com?
    Auth-->>R: 93.184.216.34, TTL 300s
    R-->>B: 93.184.216.34
```

- **Recursive resolver** — does the legwork on your behalf (your ISP's resolver, or public ones like `8.8.8.8` or `1.1.1.1`).
- **Root servers** — know where each **TLD (Top-Level Domain)** like `.com`, `.org`, `.io` is handled.
- **TLD servers** — know which authoritative servers handle each domain.
- **Authoritative server** — the final source of truth for a domain (for example AWS Route 53, Cloudflare DNS).

**Caching everywhere:** results are cached by the browser, the operating system, and the resolver for a duration called the **TTL (Time To Live)**. That's why DNS changes "take time to propagate" — old answers live in caches until their TTL expires.

#### Common DNS record types

| Record | Purpose | Example |
|---|---|---|
| **A** | Name → IPv4 address | `example.com → 93.184.216.34` |
| **AAAA** | Name → IPv6 address | `example.com → 2606:2800::1` |
| **CNAME** (Canonical Name) | Alias to another name | `www.example.com → example.com` |
| **MX** (Mail Exchange) | Mail server for the domain | `example.com → mail.example.com` |
| **TXT** | Arbitrary text (domain verification, email security) | `"v=spf1 ..."` |
| **NS** (Name Server) | Which servers are authoritative | `example.com → ns1.provider.com` |

#### DNS in system design

- **DNS load balancing** — return multiple IPs (round robin) so clients spread across servers.
- **GeoDNS / latency-based routing** — return the IP of the data center closest to the user. This is how many multi-region systems send European users to European servers.
- **Failover** — health-checked DNS can stop returning the IP of a dead region.
- **Limitation:** because of caching (TTL), DNS changes are slow to take effect; DNS is a coarse-grained tool, not a fast one.

### 2.6 TLS and HTTPS: Encryption on the Wire

**HTTPS** = HTTP over **TLS (Transport Layer Security)**. TLS (successor of the older **SSL, Secure Sockets Layer**) provides:

1. **Confidentiality** — nobody in the middle can read the data (encryption).
2. **Integrity** — nobody can modify the data without detection.
3. **Authentication** — you're really talking to `bank.com`, proven by a **certificate**.

#### Two kinds of encryption, used together

- **Asymmetric encryption** (public/private key pair) — anyone can encrypt with the public key; only the private key owner can decrypt. Slow, but solves "how do two strangers agree on a secret?"
- **Symmetric encryption** (one shared key, for example AES — Advanced Encryption Standard) — fast, used for the actual data.

TLS uses asymmetric cryptography during the **handshake** to securely agree on a symmetric **session key**, then uses the fast symmetric key for everything else.

#### Certificates and CAs

The server presents a **certificate** saying "this public key belongs to `bank.com`", digitally signed by a **CA (Certificate Authority)** that your browser already trusts (like Let's Encrypt, DigiCert). If the signature checks out, the browser trusts the server.

#### Handshake cost

- **TLS 1.2**: 2 round trips.
- **TLS 1.3**: 1 round trip (and 0 round trips when resuming a previous session).

So a fresh HTTPS connection over TCP with TLS 1.3 costs about **2 RTTs** (1 TCP + 1 TLS) before the first byte of the request. Over a 100 ms link, that's 200 ms of pure setup. Again: reuse connections, and bring servers closer to users.

#### TLS termination

**TLS termination** means decrypting HTTPS at some point — usually the **load balancer** or **API gateway** — and forwarding plain HTTP (or re-encrypted traffic) inside the private network. This offloads expensive crypto work from app servers and centralizes certificate management. For stricter security ("zero trust"), traffic is re-encrypted internally, often with **mTLS (mutual TLS)**, where both sides present certificates.

### 2.7 HTTP: HyperText Transfer Protocol

**HTTP** is the application-layer protocol of the web and of most APIs. It's a **request-response** protocol: the client sends a request, the server sends back exactly one response.

#### Anatomy of a request and response

```http
GET /api/products/42?currency=EUR HTTP/1.1
Host: shop.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOi...
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60
ETag: "a1b2c3"

{"id": 42, "name": "Keyboard", "price": 49.9}
```

- **Request line**: method (`GET`), path (`/api/products/42`), query string (`?currency=EUR`), version.
- **Headers**: metadata as key-value pairs.
- **Body**: optional payload (usually for `POST`, `PUT`, `PATCH`).
- **Status line**: version, status code (`200`), reason (`OK`).

#### HTTP is stateless

Each request is independent; the server does not automatically remember previous requests. State (who is logged in, what's in the cart) is carried by **cookies**, **tokens**, or stored server-side and referenced by an ID. Statelessness is what makes horizontal scaling easy (Section 6.2): any server can handle any request.

#### HTTP methods and their properties

Two properties matter a lot in system design:

- **Safe** — the method doesn't change server state (read-only).
- **Idempotent** — doing it once or doing it 10 times has the same effect on the server. This is crucial for **retries**: if a request times out, you can safely retry an idempotent request.

| Method | Typical use | Safe? | Idempotent? |
|---|---|---|---|
| `GET` | Read a resource | Yes | Yes |
| `HEAD` | Like GET, headers only | Yes | Yes |
| `OPTIONS` | Ask what's allowed (used by CORS preflight) | Yes | Yes |
| `POST` | Create a resource / trigger an action | No | **No** |
| `PUT` | Replace a resource entirely | No | Yes |
| `PATCH` | Partially update a resource | No | Not guaranteed |
| `DELETE` | Delete a resource | No | Yes |

Example of why this matters: a user clicks "Pay" and the network drops the response. Should the client retry? If the endpoint is `POST /payments` (not idempotent), a retry might charge the user twice. The fix is an **idempotency key** (Section 3.6).

#### Status codes

| Class | Meaning | Common codes |
|---|---|---|
| **1xx** | Informational | `101 Switching Protocols` (WebSocket upgrade) |
| **2xx** | Success | `200 OK`, `201 Created`, `202 Accepted` (async processing), `204 No Content` |
| **3xx** | Redirection | `301 Moved Permanently`, `302 Found` (temporary), `304 Not Modified` (use your cache) |
| **4xx** | Client error | `400 Bad Request`, `401 Unauthorized` (not authenticated), `403 Forbidden` (authenticated but not allowed), `404 Not Found`, `409 Conflict`, `429 Too Many Requests` (rate limited) |
| **5xx** | Server error | `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout` |

Design-relevant codes: `202 Accepted` for async jobs ("we got it, check back later"), `429` for rate limiting, `301` vs `302` for URL shorteners (Section 19.4), `304` for caching, `503` for load shedding.

#### Important headers

| Header | Purpose |
|---|---|
| `Content-Type` | Format of the body (`application/json`, `text/html`) |
| `Accept` | Formats the client can handle |
| `Authorization` | Credentials (for example `Bearer <token>`) |
| `Cookie` / `Set-Cookie` | Send / set cookies |
| `Cache-Control` | Caching rules (`max-age=60`, `no-store`, `private`, `public`) |
| `ETag` / `If-None-Match` | Version tag of a resource; client asks "only send if changed" → `304` |
| `Location` | Where to go on redirect, or URL of newly created resource |
| `Retry-After` | How long to wait (with `429` or `503`) |
| `X-Forwarded-For` | Original client IP when behind proxies |

#### Cookies and sessions (briefly)

A **cookie** is a small piece of data the server asks the browser to store and send back on every request to that domain. Common use: a **session ID** cookie, where the server keeps session data (in memory, Redis, or a database) keyed by that ID. Security flags: `HttpOnly` (JavaScript can't read it), `Secure` (only over HTTPS), `SameSite` (limits cross-site sending, helps against CSRF — Section 16.6).

### 2.8 HTTP Versions: 1.0, 1.1, 2, and 3

The HTTP *semantics* (methods, status codes, headers) stayed the same; what changed is **how messages travel over the network**.

#### HTTP/1.0 and HTTP/1.1

- **HTTP/1.0**: a new TCP connection for every request. Very slow (handshake each time).
- **HTTP/1.1** (1997): **persistent connections (keep-alive)** — reuse one TCP connection for many requests. But on one connection, requests are handled **one at a time**: the next request waits until the previous response arrives. (Pipelining tried to fix this but was broken in practice.)
- Browsers worked around this by opening **~6 parallel TCP connections per host**, and developers used tricks like domain sharding, sprite sheets, and bundling.

#### HTTP/2 (2015)

- **Binary framing** — messages are split into small binary **frames** instead of text.
- **Multiplexing** — many requests and responses (**streams**) are interleaved over a **single TCP connection** at the same time. No more waiting in line at the HTTP level.
- **Header compression (HPACK)** — repeated headers (cookies, user agent) are compressed.
- **Server push** — server could send resources before being asked. (Rarely used; major browsers removed support.)
- **Remaining problem:** still runs on TCP, so a single lost packet stalls *all* streams (**TCP head-of-line blocking**).

#### HTTP/3 (2022)

- Runs on **QUIC** (originally "Quick UDP Internet Connections"), a transport protocol built on **UDP**.
- QUIC implements reliability **per stream**, so a lost packet only stalls its own stream — no cross-stream HOL blocking.
- **TLS 1.3 is built in**; connection setup is usually **1 RTT** total (vs TCP + TLS = 2 RTTs), and **0-RTT** for repeat connections.
- **Connection migration** — connections survive network changes (Wi-Fi to cellular) because they're identified by a connection ID, not by IP and port.

```mermaid
flowchart TB
    subgraph H1["HTTP/1.1"]
        A1["Request 1"] --> A2["Response 1"] --> A3["Request 2"] --> A4["Response 2"]
    end
    subgraph H2["HTTP/2 over TCP"]
        B1["Streams 1, 2, 3 interleaved on one TCP connection"]
        B2["One lost packet stalls all streams"]
        B1 --- B2
    end
    subgraph H3["HTTP/3 over QUIC and UDP"]
        C1["Streams 1, 2, 3 independent"]
        C2["Lost packet stalls only its own stream"]
        C1 --- C2
    end
```

| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Transport | TCP | TCP | QUIC over UDP |
| Format | Text | Binary frames | Binary frames |
| Concurrency per connection | One request at a time | Multiplexed streams | Multiplexed, independent streams |
| Header compression | No | HPACK | QPACK |
| HOL blocking | HTTP level and TCP level | TCP level only | None across streams |
| Setup cost (with TLS 1.3) | 2 RTT | 2 RTT | 1 RTT (0 on resume) |

**In interviews:** you'll mostly mention HTTP/2 when discussing **gRPC** (which requires HTTP/2) or efficient connections between services, and HTTP/3 when discussing mobile users on flaky networks.

### 2.9 Real-Time Communication: Polling, Long Polling, SSE, WebSockets, WebRTC, Webhooks

Plain HTTP is **client-initiated**: the server can only respond, never speak first. But many features need the server to push updates: chat messages, notifications, live scores, stock prices, collaborative editing, ride location. Here are the options, from simplest to most powerful.

#### 1. Short polling

The client asks every N seconds: "anything new?"

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    C->>S: Anything new?
    S-->>C: No
    Note over C: wait 5 seconds
    C->>S: Anything new?
    S-->>C: No
    Note over C: wait 5 seconds
    C->>S: Anything new?
    S-->>C: Yes, 1 message
```

- **Pros:** trivial, works everywhere, stateless.
- **Cons:** wasteful (most responses are "no"), latency up to N seconds.
- **Use when:** updates are infrequent and a few seconds of delay is fine (checking a job's status every 10 seconds).

#### 2. Long polling

The client asks; the server **holds the request open** until there's data (or a timeout, say 30 s), then responds. The client immediately asks again.

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    C->>S: Anything new?
    Note over S: holds request open...
    S-->>C: Yes, new message
    C->>S: Anything new?
    Note over S: holds... 30s timeout
    S-->>C: Nothing, try again
    C->>S: Anything new?
```

- **Pros:** near-real-time, works over plain HTTP, fewer empty responses.
- **Cons:** each waiting client ties up a connection; reconnect overhead after every message; ordering and missed-message handling are on you.
- **Use when:** you need near-real-time but can't use WebSockets/SSE (old infrastructure, strict proxies).

#### 3. SSE: Server-Sent Events

**SSE** is a standard where the client opens one long-lived HTTP connection, and the server **streams events** down it as they happen. The response has `Content-Type: text/event-stream`, and the browser API is `EventSource`.

```
data: {"type":"score","home":2,"away":1}

id: 42
event: goal
data: {"player":"Smith","minute":78}

```

- **One direction only:** server → client. (Client-to-server messages go over normal HTTP requests.)
- **Built-in reconnection:** the browser auto-reconnects and sends the `Last-Event-ID` header, so the server can resume from where it left off.
- **Plain HTTP:** works with existing load balancers, proxies, authentication, and HTTP/2 multiplexing.
- **Text only** (UTF-8); binary must be encoded.
- **Great for:** live feeds, notifications, dashboards, stock tickers, and — very commonly today — **streaming LLM (Large Language Model) responses token by token**.

#### 4. WebSockets

A **WebSocket** is a **persistent, full-duplex** (both directions at the same time) connection over a single TCP connection. It starts as an HTTP request and then "upgrades":

```http
GET /chat HTTP/1.1
Host: chat.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
```

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
```

After the `101`, both sides can send messages (text or binary **frames**) at any time with very little overhead per message.

- **Pros:** lowest latency, bidirectional, low per-message overhead, supports binary.
- **Cons:** **stateful** connections are harder to scale and load balance; no built-in reconnection or message replay (you implement it); some corporate proxies interfere; each connection consumes server memory.
- **Great for:** chat, multiplayer games, collaborative editing (Google Docs style), live trading.

**Scaling WebSockets — a very common interview deep-dive.** If user A is connected to server 1 and user B is connected to server 2, how does A's message reach B? Typical answer:

```mermaid
flowchart LR
    A["User A"] <-->|"WebSocket"| WS1["WS Server 1"]
    B["User B"] <-->|"WebSocket"| WS2["WS Server 2"]
    WS1 -->|"publish to channel of B"| PS[("Pub/Sub: Redis or Kafka")]
    PS -->|"deliver"| WS2
    WS1 --> REG[("Connection registry: user to server")]
    WS2 --> REG
```

- Keep a **connection registry** (for example in Redis): which user is connected to which server.
- Use a **pub/sub backplane** (Redis Pub/Sub, Kafka, NATS): servers publish messages to channels; the server holding the recipient's connection delivers it.
- Load balancers must support long-lived connections; some designs use **sticky sessions** (Section 6.4).
- A single well-tuned server can hold on the order of **tens to hundreds of thousands** of mostly idle connections; the limit is usually memory and file descriptors, not CPU.

#### 5. WebRTC

**WebRTC (Web Real-Time Communication)** enables **peer-to-peer** audio, video, and data directly between browsers, typically over UDP. Servers are still needed for **signaling** (exchanging connection info, often via WebSocket), **STUN (Session Traversal Utilities for NAT)** servers to discover public IPs, and **TURN (Traversal Using Relays around NAT)** servers to relay traffic when direct connection fails. Use for video calls, voice, screen sharing. For large group calls, a server called an **SFU (Selective Forwarding Unit)** forwards streams instead of pure peer-to-peer.

#### 6. Webhooks

A **webhook** is a **server-to-server** push: "when event X happens, send an HTTP POST to this URL I registered." Stripe notifying your backend of a successful payment, or GitHub notifying your CI system of a push, are webhooks.

- The receiver must be publicly reachable, should **verify signatures** (to ensure the sender is legit), and must be **idempotent** (senders retry, so duplicates happen).
- Not for browsers — browsers can't receive incoming HTTP requests.

#### Choosing a real-time technique

| Technique | Direction | Latency | Complexity | Typical use |
|---|---|---|---|---|
| Short polling | Client pulls | Seconds | Very low | Job status, infrequent updates |
| Long polling | Client pulls (held) | Near real-time | Low–medium | Fallback when others unavailable |
| SSE | Server → client | Real-time | Low | Notifications, feeds, live scores, LLM streaming |
| WebSocket | Both ways | Real-time, lowest | Medium–high | Chat, games, collaboration |
| WebRTC | Peer to peer | Real-time, lowest | High | Video/voice calls |
| Webhook | Server → server | Near real-time | Low | Payment events, integrations |

**Decision shortcut:**
- Only the server needs to push? → **SSE** (simpler than WebSockets).
- Both sides send frequently with low latency? → **WebSocket**.
- Audio/video between users? → **WebRTC**.
- Notifying another backend? → **Webhook**.
- Rare updates and simplicity above all? → **Polling**.

**Key takeaways**
- L4 = IP and port (TCP/UDP); L7 = application data (HTTP). Load balancers are described this way.
- TCP = reliable, ordered, handshake cost, head-of-line blocking. UDP = fast, unreliable, used for real-time media, DNS, and QUIC.
- DNS maps names to IPs, is heavily cached (TTL), and can route users geographically.
- TLS gives encryption, integrity, and authentication; it's usually terminated at the load balancer.
- HTTP is stateless request/response. Know safe vs idempotent methods and key status codes.
- HTTP/2 multiplexes over one TCP connection; HTTP/3 uses QUIC over UDP to remove head-of-line blocking.
- For server push: SSE (one-way, simple), WebSockets (two-way, stateful, harder to scale), WebRTC (peer-to-peer media), webhooks (server-to-server).

---

## Part 3: APIs — How Components Talk

An **API (Application Programming Interface)** is a contract: "send me a request shaped like this, and I'll respond with data shaped like that." In HLD interviews you'll almost always define the external API of your system, and often mention how internal services talk to each other.

### 3.1 REST: Representational State Transfer

**REST** is an architectural style (not a protocol) for APIs over HTTP. It models your system as **resources** (nouns) manipulated through standard **HTTP methods** (verbs).

#### Core principles

1. **Resources identified by URLs** — `/users/123`, `/users/123/orders`.
2. **Standard methods** — `GET` reads, `POST` creates, `PUT`/`PATCH` updates, `DELETE` deletes.
3. **Stateless** — each request carries everything needed (for example the auth token); the server keeps no per-client conversation state.
4. **Representations** — the same resource can be returned as JSON, XML, etc.
5. **Cacheable** — responses declare whether they can be cached (`Cache-Control`).
6. **Uniform interface** — consistent patterns across the API. (Strict REST also includes **HATEOAS — Hypermedia As The Engine Of Application State**, where responses include links to next actions; most real APIs skip it.)

#### Example: a REST API for a blog

| Action | Method and path | Success status |
|---|---|---|
| List posts | `GET /posts?limit=20&cursor=abc` | `200` |
| Get one post | `GET /posts/42` | `200` |
| Create post | `POST /posts` | `201` + `Location: /posts/43` |
| Replace post | `PUT /posts/42` | `200` |
| Edit title | `PATCH /posts/42` | `200` |
| Delete post | `DELETE /posts/42` | `204` |
| List a post's comments | `GET /posts/42/comments` | `200` |

**Naming conventions:** plural nouns (`/posts`, not `/getPosts`), nesting for ownership (`/posts/42/comments`), query parameters for filtering, sorting, and pagination.

#### REST strengths and weaknesses

- **Strengths:** simple, universal, human-readable, works with every HTTP tool, easy to cache with HTTP caching and CDNs.
- **Weaknesses:**
  - **Over-fetching** — `GET /users/123` returns 40 fields when the mobile screen needs 3.
  - **Under-fetching (the N+1 request problem)** — to show a feed you call `GET /posts`, then `GET /users/{id}` for each author, then `GET /posts/{id}/likes`... many round trips.
  - Text-based JSON is larger and slower to parse than binary formats.

### 3.2 GraphQL

**GraphQL** (created at Facebook) is a **query language for APIs**. There's typically a **single endpoint** (`POST /graphql`), and the client describes **exactly the data shape it wants**.

```graphql
query {
  user(id: "123") {
    name
    avatarUrl
    posts(first: 3) {
      title
      likeCount
    }
  }
}
```

Response — exactly that shape, nothing more:

```json
{
  "data": {
    "user": {
      "name": "Ada",
      "avatarUrl": "https://cdn.example.com/a.png",
      "posts": [
        { "title": "Hello", "likeCount": 10 },
        { "title": "GraphQL", "likeCount": 4 }
      ]
    }
  }
}
```

#### Key concepts

- **Schema** — a strongly typed description of all types and fields (the contract).
- **Query** — read. **Mutation** — write. **Subscription** — real-time updates (usually over WebSocket).
- **Resolvers** — server functions that fetch each field.

#### Strengths

- Solves over-fetching and under-fetching: one round trip, exact fields.
- Great for **multiple clients** with different needs (web, iOS, Android).
- Strong typing and introspection → excellent tooling (a natural fit with TypeScript codegen).
- Often used as a **BFF (Backend For Frontend)** or aggregation layer over many microservices.

#### Weaknesses

- **HTTP caching is harder** — everything is `POST /graphql`, so CDNs can't cache by URL easily (workarounds: persisted queries, client-side normalized caches like Apollo).
- **The N+1 query problem on the server** — resolving `posts → author` for 100 posts can trigger 100 database queries. Fix: batching with **DataLoader**.
- **Expensive queries** — clients can request deeply nested data; you need depth limits, complexity analysis, and rate limiting by query cost.
- More complex server setup; error handling is non-standard (often `200 OK` with an `errors` array).

### 3.3 gRPC

**gRPC** (from Google; "gRPC Remote Procedure Call") is a high-performance **RPC (Remote Procedure Call)** framework. Instead of resources, you call **functions on a remote server** as if they were local.

- Contracts are defined in **Protocol Buffers (Protobuf)**, a compact **binary** serialization format.
- Runs over **HTTP/2** (multiplexing, streaming, header compression).
- **Code generation** creates typed client and server stubs in many languages.

```protobuf
syntax = "proto3";

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc StreamUserEvents (GetUserRequest) returns (stream UserEvent);
}

message GetUserRequest {
  string id = 1;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}
```

#### Four communication modes

| Mode | Description | Example |
|---|---|---|
| Unary | One request, one response | `GetUser` |
| Server streaming | One request, stream of responses | Live price updates |
| Client streaming | Stream of requests, one response | Uploading sensor readings |
| Bidirectional streaming | Both stream independently | Chat, real-time sync |

#### Strengths

- **Fast and compact**: binary Protobuf is typically several times smaller and faster to parse than JSON.
- **Strict contracts** with backward-compatible evolution (field numbers).
- **Streaming** built in.
- Ideal for **internal service-to-service communication** in microservices.

#### Weaknesses

- **Browsers can't call gRPC directly** (need **gRPC-Web** plus a proxy).
- Not human-readable; harder to debug with curl.
- Needs HTTP/2 end to end (some load balancers need L7 support for proper balancing, because one long-lived HTTP/2 connection carries many requests).

### 3.4 Other API Styles You Should Recognize

- **SOAP (Simple Object Access Protocol)** — older XML-based protocol with strict contracts (WSDL). Still found in banking and enterprise systems.
- **tRPC** — TypeScript-only RPC that shares types between client and server with no schema or codegen. Great for full-stack TypeScript monorepos; not for public or polyglot APIs.
- **JSON-RPC** — simple RPC using JSON messages.
- **Event-based / async APIs** — communication through message brokers (Part 11); described with AsyncAPI specs.

### 3.5 Choosing an API Style

| | REST | GraphQL | gRPC |
|---|---|---|---|
| Paradigm | Resources + HTTP verbs | Query language, client picks fields | Remote function calls |
| Transport | HTTP/1.1 or 2 | HTTP (usually POST) | HTTP/2 |
| Format | JSON (usually) | JSON | Protobuf (binary) |
| Contract | Optional (OpenAPI) | Required schema | Required .proto |
| HTTP caching | Easy | Hard | Not applicable |
| Performance | Good | Good (fewer round trips) | Best |
| Browser support | Native | Native | Needs gRPC-Web |
| Streaming | Via SSE/WebSocket | Subscriptions | Native |
| Best for | Public APIs, CRUD, simple integrations | Many client types with varying data needs, aggregating services | Internal microservice communication, low latency, polyglot |

**Common real-world combination:** REST or GraphQL at the **edge** (public, browser/mobile-facing) + gRPC **internally** between services + message queues for **async** work.

**Default in interviews:** use **REST** for the external API unless there's a reason not to. It's the easiest to reason about on a whiteboard.

### 3.6 API Design Essentials

#### Pagination

Never return unbounded lists. Two main strategies:

**Offset pagination:** `GET /posts?limit=20&offset=40`

- SQL: `SELECT ... ORDER BY created_at DESC LIMIT 20 OFFSET 40`
- Pros: simple, can jump to page N.
- Cons: **slow for deep pages** (the database still scans and discards all skipped rows); **inconsistent** when data changes (new items shift pages → duplicates or skipped items).

**Cursor pagination (keyset pagination):** `GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ`

- The cursor encodes the position of the last seen item (for example `created_at` + `id`).
- SQL: `SELECT ... WHERE (created_at, id) < (:lastCreatedAt, :lastId) ORDER BY created_at DESC, id DESC LIMIT 20`
- Pros: **fast at any depth** (uses an index), **stable** under inserts.
- Cons: can't jump to arbitrary pages.
- **Use for feeds, timelines, infinite scroll** — i.e., almost always in large systems.

#### Versioning

APIs evolve; clients (especially mobile apps) can't all update at once.

- **URL versioning**: `/v1/posts` → `/v2/posts` (most common, most visible).
- **Header versioning**: `Accept: application/vnd.example.v2+json`.
- Prefer **backward-compatible changes** (adding optional fields) so you rarely need new versions.

#### Idempotency keys

For non-idempotent operations (payments, orders), the client generates a unique key and sends it:

```http
POST /payments
Idempotency-Key: 7f3c9a2e-1b4d-4c8a-9e2f-5d6a7b8c9d0e
```

The server stores the key with the result. If the same key arrives again (a retry), it returns the stored result instead of charging again. This turns an unsafe retry into a safe one — a pattern used by Stripe and most payment APIs.

#### Rate limiting

Protect the API from abuse and overload: return `429 Too Many Requests` with headers like `Retry-After` and `X-RateLimit-Remaining`. Algorithms are covered in Section 13.6.

#### Other good practices

- Consistent error format: `{ "error": { "code": "INSUFFICIENT_FUNDS", "message": "...", "requestId": "..." } }`.
- Filtering and sorting via query params: `?status=active&sort=-createdAt`.
- Use `202 Accepted` + a status URL for long-running operations (video processing, report generation).
- Don't expose internal IDs or implementation details you might want to change.

### 3.7 Authentication and Authorization for APIs

Two different questions:

- **Authentication (AuthN)** — *Who are you?* (login, identity)
- **Authorization (AuthZ)** — *What are you allowed to do?* (permissions)

`401 Unauthorized` actually means "not authenticated"; `403 Forbidden` means "authenticated, but not allowed."

#### Session-based authentication (stateful)

1. User logs in with username and password.
2. Server creates a session record (in Redis or a database) and returns a **session ID** in a cookie.
3. Every request sends the cookie; the server looks up the session.

- **Pros:** easy revocation (delete the session), small cookie.
- **Cons:** needs a shared session store for multiple servers (a lookup on every request).

#### Token-based authentication with JWT (stateless)

A **JWT (JSON Web Token)** is a signed token with three Base64-encoded parts: `header.payload.signature`.

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDAwMDAwMDB9.abc123signature
```

Decoded payload: `{ "sub": "123", "role": "admin", "exp": 1700000000 }`

- The server **verifies the signature** with its key — no database lookup needed. Any server (or service) can validate it.
- **Pros:** stateless, scales easily, works across services.
- **Cons:** **hard to revoke** before expiry (a stolen token works until `exp`). Common mitigation: **short-lived access tokens** (5–15 minutes) + **long-lived refresh tokens** stored server-side (revocable), and sometimes a revocation denylist.
- JWTs are **signed, not encrypted** by default — never put secrets in the payload.

#### OAuth 2.0 and OpenID Connect

- **OAuth 2.0** is a framework for **delegated authorization**: letting an app access your resources on another service without giving it your password. "Allow this app to read your Google Calendar."
- Roles: **resource owner** (the user), **client** (the app), **authorization server** (issues tokens, for example Google's), **resource server** (the API holding the data).
- The most common flow for web and mobile apps is the **Authorization Code flow with PKCE (Proof Key for Code Exchange)**.
- **OIDC (OpenID Connect)** is a thin layer on top of OAuth 2.0 that adds **authentication** ("Sign in with Google"), returning an **ID token** (a JWT describing the user).

```mermaid
sequenceDiagram
    participant U as User
    participant App as Client App
    participant AS as Authorization Server
    participant API as Resource Server
    U->>App: Click Sign in with Google
    App->>AS: Redirect user to login and consent
    U->>AS: Log in and approve
    AS-->>App: Redirect back with authorization code
    App->>AS: Exchange code plus PKCE verifier for tokens
    AS-->>App: Access token, refresh token, ID token
    App->>API: Request with Bearer access token
    API-->>App: Protected data
```

#### Other mechanisms

- **API keys** — a static secret identifying the calling application (server-to-server, public developer APIs). Simple but coarse.
- **mTLS (mutual TLS)** — both client and server present certificates; common for service-to-service security inside a company.

#### Authorization models

- **RBAC (Role-Based Access Control)** — permissions attached to roles (admin, editor, viewer).
- **ABAC (Attribute-Based Access Control)** — rules on attributes ("user can edit documents where `doc.teamId == user.teamId`").
- **ReBAC (Relationship-Based Access Control)** — permissions derived from relationships (Google Docs sharing; Google's Zanzibar system).

**Key takeaways**
- REST: resources + HTTP verbs; simple, cacheable; default for public APIs.
- GraphQL: client chooses fields; great for many clients; caching and query-cost control are harder.
- gRPC: binary, HTTP/2, typed contracts, streaming; best for internal service-to-service calls.
- Use cursor pagination for large or changing lists; idempotency keys for unsafe operations.
- AuthN = who you are; AuthZ = what you may do. Sessions are easy to revoke; JWTs are stateless but hard to revoke; OAuth 2.0 delegates authorization; OIDC adds login.

---

## Part 4: Measuring Systems — Performance and Reliability Vocabulary

Before you can design a system to be "fast" or "reliable," you need precise words for those ideas. This part covers the vocabulary interviewers expect you to use fluently.

### 4.1 Latency, Throughput, and Bandwidth

These three are often confused.

| Term | Definition | Unit | Analogy (a highway) |
|---|---|---|---|
| **Latency** | Time for one request to complete | ms, μs | How long one car takes to drive from A to B |
| **Throughput** | How many requests are completed per unit of time | requests/s, QPS, MB/s | How many cars arrive per hour |
| **Bandwidth** | Maximum possible data rate of a link | Mbps, Gbps | How many lanes the highway has |

- **QPS (Queries Per Second)** and **RPS (Requests Per Second)** are the usual throughput units; **TPS (Transactions Per Second)** is used for databases and payments.
- You can have **high bandwidth but high latency** (a satellite link: lots of data per second, but each packet takes 600 ms), or **low latency but low throughput** (a single fast server that handles only a few requests at once).
- **Units trap:** network bandwidth is in **bits** per second, storage in **bytes**. `1 Gbps = 125 MB/s` (divide by 8).

#### Little's Law — connecting latency and throughput

A very useful formula from queueing theory:

```
Concurrency (L) = Throughput (λ) × Latency (W)
```

Example: your service handles **2,000 requests/s** and each takes **150 ms** on average. At any moment, about `2,000 × 0.15 = 300` requests are in flight. If each server can process 50 requests concurrently (for example, 50 worker threads or DB connections), you need at least `300 / 50 = 6` servers. It also shows why **slow dependencies are dangerous**: if latency doubles, the concurrency you need doubles, and you can run out of threads or connections.

### 4.2 Percentiles: p50, p95, p99

Averages hide problems. If 99 requests take 10 ms and 1 takes 5 seconds, the average is ~60 ms — which describes nobody's experience.

**Percentiles** describe the distribution:

- **p50 (median)**: 50% of requests are faster than this. The "typical" experience.
- **p95**: 95% are faster; 5% are slower.
- **p99**: 99% are faster; the slowest 1% are slower. This is the **tail latency**.
- **p99.9**: the slowest 1 in 1,000.

```
Latency distribution of 1,000 requests

 count
   |  ####
   |  ######
   |  ########
   |  ##########
   |  ############ ##
   |  ##############  ###  #     #          #
   +--------------------------------------------> latency
     p50=40ms     p95=120ms   p99=400ms   max=2s
```

**Why tail latency matters so much at scale:**

1. **Your heaviest users hit it most.** Users with the most data (biggest carts, most followers) often have the slowest requests — and they're often your most valuable users.
2. **Fan-out amplifies it.** If one page load calls 100 backend services in parallel, the page is as slow as the *slowest* of them. The chance that at least one of 100 calls hits its p99 is `1 − 0.99^100 ≈ 63%`. So a backend's p99 becomes the page's typical latency.

That's why requirements are usually stated as "**p99 latency under 200 ms**," not "average under 200 ms."

### 4.3 Availability and "the Nines"

**Availability** = the fraction of time a system is working and serving requests correctly.

```
Availability = uptime / (uptime + downtime)
```

It's usually expressed in **"nines"**:

| Availability | Nickname | Downtime per year | Downtime per 30-day month |
|---|---|---|---|
| 99% | two nines | 3.65 days | 7.2 hours |
| 99.9% | three nines | 8.76 hours | 43.2 minutes |
| 99.95% | three and a half nines | 4.38 hours | 21.6 minutes |
| 99.99% | four nines | 52.6 minutes | 4.32 minutes |
| 99.999% | five nines | 5.26 minutes | 25.9 seconds |

**Each extra nine is roughly 10× harder and more expensive.** Four nines means you can't rely on humans reacting to alerts — failover must be automatic. Five nines usually requires multi-region active-active setups.

#### Availability of combined components

**In series** (request must pass through all of them): multiply.

```
Client -> LB (99.99%) -> App (99.9%) -> DB (99.9%)
Total = 0.9999 × 0.999 × 0.999 ≈ 0.9979 → ~99.8%
```

The chain is **weaker than its weakest link**. Every dependency you add in the critical path lowers availability.

**In parallel** (redundant copies; system works if at least one works):

```
Availability = 1 − (1 − A)^n
Two servers at 99% each: 1 − (0.01)^2 = 0.9999 → 99.99%
```

**Redundancy is the main tool for increasing availability.** This assumes failures are independent — two servers in the same rack with the same power supply are *not* independent. That's why we spread copies across **availability zones** and **regions** (Part 18).

#### MTBF and MTTR

- **MTBF (Mean Time Between Failures)** — how long, on average, the system runs before failing.
- **MTTR (Mean Time To Recovery / Repair)** — how long, on average, it takes to recover.

```
Availability = MTBF / (MTBF + MTTR)
```

Two ways to improve availability: fail less often (higher MTBF) or **recover faster** (lower MTTR). In practice, lowering MTTR — fast detection, automatic failover, quick rollbacks — is often easier and more effective.

### 4.4 SLI, SLO, SLA, and Error Budgets

These come from Google's **SRE (Site Reliability Engineering)** practice and are extremely common in senior interviews.

| Term | Full form | What it is | Example |
|---|---|---|---|
| **SLI** | Service Level **Indicator** | A **measurement** of some aspect of service quality | "Fraction of HTTP requests that returned non-5xx in under 300 ms" |
| **SLO** | Service Level **Objective** | An internal **target** for an SLI over a time window | "99.9% of requests succeed in under 300 ms, measured over 30 days" |
| **SLA** | Service Level **Agreement** | A **contract** with customers, with penalties if broken | "99.9% monthly uptime, or you get a 10% service credit" |

The relationship: **SLI is what you measure, SLO is what you aim for, SLA is what you promise (with consequences).** SLOs are set **stricter** than SLAs so you get warning before breaching a contract.

```mermaid
flowchart LR
    SLI["SLI: measured value, for example 99.95% success this month"] --> SLO["SLO: internal target, for example 99.9%"]
    SLO --> SLA["SLA: external contract, for example 99.5% with refunds"]
```

**Good SLIs** reflect what users actually feel:

- **Availability**: successful requests / total requests.
- **Latency**: fraction of requests faster than a threshold (for example p99 < 300 ms).
- **Freshness**: fraction of data updated within N minutes (for pipelines).
- **Durability**: fraction of stored data retrievable.

#### Error budget

If your SLO is 99.9%, you are **allowed** to fail 0.1% of the time. That 0.1% is your **error budget**: over a 30-day month, about 43 minutes of downtime or 1 in 1,000 failed requests.

The error budget turns reliability into an engineering decision:

- **Budget remaining** → ship features faster, take risks, run experiments.
- **Budget exhausted** → freeze risky launches, focus on reliability work.

This resolves the eternal conflict between "move fast" (product) and "don't break things" (operations): 100% reliability is neither possible nor desirable, because it would stop all change.

### 4.5 Durability, RPO, and RTO

- **Durability** — the probability that data, once stored, is **not lost**. Different from availability: a system can be down (unavailable) but still have all data safe (durable). Amazon S3 is designed for 99.999999999% ("eleven nines") durability by storing copies across multiple facilities.
- **RPO (Recovery Point Objective)** — **how much data you can afford to lose**, measured in time. RPO = 5 minutes means after a disaster you may lose up to the last 5 minutes of writes. Driven by how often you back up or replicate.
- **RTO (Recovery Time Objective)** — **how long you can afford to be down** after a disaster before service is restored.

```
         last backup                 disaster              service restored
------------|---------------------------X---------------------------|------> time
            <-------- RPO: data lost --->
                                        <---------- RTO: downtime -->
```

Lower RPO and RTO cost more money (continuous replication, hot standbys). We revisit disaster recovery strategies in Section 13.9.

### 4.6 Scalability, Elasticity, and Other "-ilities"

In requirements discussions, **non-functional requirements** (qualities, not features) are phrased with these words:

| Term | Meaning |
|---|---|
| **Scalability** | Ability to handle more load by adding resources, without redesign |
| **Elasticity** | Ability to scale up **and down** automatically with demand (pay for what you use) |
| **Availability** | Fraction of time the system is up and serving |
| **Reliability** | System keeps working correctly (produces correct results) over time, even with faults |
| **Fault tolerance** | Ability to keep working despite component failures |
| **Resilience** | Ability to recover quickly from failures |
| **Durability** | Stored data is not lost |
| **Consistency** | All readers see the same, up-to-date data (precise meanings in Part 10) |
| **Maintainability** | Easy to understand, change, and operate |
| **Observability** | Ability to understand internal state from outputs (logs, metrics, traces) |

**Key takeaways**
- Latency = time per request; throughput = requests per second; bandwidth = link capacity. Little's Law: concurrency = throughput × latency.
- Use percentiles (p99), not averages. Tail latency gets amplified by fan-out.
- Availability in nines: 99.9% ≈ 43 min/month, 99.99% ≈ 4 min/month. Series multiplies (worse), parallel redundancy improves it.
- SLI = measurement, SLO = target, SLA = contract. Error budget = 1 − SLO.
- Durability ≠ availability. RPO = acceptable data loss; RTO = acceptable downtime.

---

## Part 5: Back-of-the-Envelope Estimation

**Back-of-the-envelope estimation** means quick, rough calculations (the kind you could do on the back of an envelope) to figure out the **scale** of a system: how many requests per second, how much storage, how much bandwidth, how many servers.

### 5.1 Why Estimate at All?

Estimation isn't about getting exact numbers. It's about **making design decisions**:

- 50 writes/second? A single PostgreSQL instance handles that easily — no sharding needed.
- 500,000 writes/second? You need a horizontally scalable, write-optimized database, sharding, maybe queues.
- 80 GB of hot data? Fits in RAM on one cache node (or a small cluster).
- 50 TB of hot data? You need a distributed cache or a different strategy.
- 100 Gbps of image traffic? That must go through a CDN, not your app servers.

Being off by 2× doesn't matter. Being off by 1,000× means a wrong design. So: **round aggressively, keep orders of magnitude right, state assumptions out loud.**

### 5.2 Numbers You Should Know

#### Powers of two and data units

| Power | Exact value | Approximation | Unit |
|---|---|---|---|
| 2^10 | 1,024 | ~1 thousand (10^3) | 1 KB (kilobyte) |
| 2^20 | 1,048,576 | ~1 million (10^6) | 1 MB (megabyte) |
| 2^30 | ~1.07 billion | ~1 billion (10^9) | 1 GB (gigabyte) |
| 2^40 | ~1.1 trillion | ~1 trillion (10^12) | 1 TB (terabyte) |
| 2^50 | ~1.13 quadrillion | ~10^15 | 1 PB (petabyte) |

For estimation, treat `1 KB = 1,000 bytes`, `1 MB = 1,000 KB`, etc. The 2.4% difference is irrelevant.

**The magic multiplication trick:** multiply the "counts" and the "sizes" separately using powers of ten.

- 1 million × 1 KB = 10^6 × 10^3 bytes = 10^9 bytes = **1 GB**
- 1 billion × 1 KB = 10^9 × 10^3 = 10^12 = **1 TB**
- 100 million × 500 bytes = 10^8 × 5×10^2 = 5×10^10 = **50 GB**
- 1 billion × 1 MB = 10^9 × 10^6 = 10^15 = **1 PB**

Memorize the ladder: **thousand → KB, million → MB, billion → GB, trillion → TB.**

#### Size of common data

| Data | Typical size |
|---|---|
| Boolean | 1 byte (often stored as 1 byte, not 1 bit) |
| ASCII character | 1 byte |
| Unicode character (UTF-8) | 1–4 bytes (English 1, most European 2, CJK 3, emoji 4) |
| 32-bit integer (int) | 4 bytes |
| 64-bit integer (bigint), double | 8 bytes |
| Timestamp | 8 bytes (4 bytes as Unix seconds in 32 bits) |
| UUID | 16 bytes binary (36 bytes as a text string) |
| IPv4 address | 4 bytes |
| Short text: username, URL, title | 50–200 bytes |
| A tweet-like post with metadata | ~300 bytes to 1 KB |
| Typical JSON API response | 1–10 KB |
| Thumbnail image | 10–50 KB |
| Compressed photo (web) | 200 KB – 2 MB |
| 1 minute of MP3 audio (128 kbps) | ~1 MB |
| 1 minute of 1080p video (~5 Mbps) | ~40 MB |
| 1 minute of 4K video (~20 Mbps) | ~150 MB |

When unsure, **round up to a convenient number** (for example "1 KB per post including metadata and index overhead").

#### Time conversions

| Period | Seconds | Estimation shortcut |
|---|---|---|
| 1 minute | 60 | |
| 1 hour | 3,600 | |
| 1 day | 86,400 | **≈ 100,000 (10^5)** |
| 1 month | ~2.6 million | ≈ 2.5 × 10^6 |
| 1 year | ~31.5 million | ≈ 3 × 10^7 |

**The most useful shortcut in all of system design:**

```
Requests per second ≈ Requests per day / 100,000
```

- 1 million requests/day ≈ **~10 QPS** (exactly 11.6)
- 100 million/day ≈ **~1,000 QPS**
- 1 billion/day ≈ **~10,000 QPS**

(Dividing by 10^5 instead of 86,400 underestimates QPS by about 14%. That's fine: the peak multiplier you apply next is far larger than this error.)

#### Peak vs average

Traffic isn't uniform. There are daily cycles, events, and spikes. Common assumption: **peak ≈ 2–3× average** for normal products; **10× or more** for spiky events (ticket sales, Black Friday, a live sports final). Always size for **peak**, not average.

#### Latency numbers every engineer should know

These are rounded orders of magnitude (popularized by Jeff Dean and Peter Norvig, updated for modern hardware). Exact values vary; **the ratios are what matter.**

| Operation | Approximate latency | Relative feel |
|---|---|---|
| L1 CPU cache reference | ~1 ns | Instant |
| L2 CPU cache reference | ~4 ns | |
| Main memory (RAM) reference | ~100 ns | |
| Compress 1 KB with a fast algorithm | ~2 μs | |
| Send 1 KB over a 1 Gbps network | ~10 μs | |
| Read 4 KB randomly from SSD | ~20–100 μs | ~1,000× slower than RAM |
| Read 1 MB sequentially from RAM | ~tens of μs | |
| Round trip within the same data center | ~0.5 ms | |
| Read 1 MB sequentially from SSD | ~0.2–1 ms | |
| HDD (spinning disk) seek | ~10 ms | Very slow |
| Read 1 MB sequentially from HDD | ~5–20 ms | |
| Round trip US East ↔ US West | ~60–70 ms | |
| Round trip US ↔ Europe | ~80–100 ms | |
| Round trip US ↔ Asia / Australia | ~150–200 ms | |

**Lessons to internalize:**

1. **RAM is ~1,000× faster than SSD random reads**, and SSDs are ~100× faster than spinning disks for random access. → Caching in memory is powerful.
2. **Sequential access is much faster than random access** on every medium. → That's why log-structured storage (LSM trees, Kafka) is so fast for writes.
3. **A network round trip inside a data center (~0.5 ms) is much slower than a memory read.** → Avoid chatty calls; batch requests.
4. **Crossing continents costs ~100+ ms per round trip, and physics (speed of light) won't improve.** → Put data and servers near users (CDNs, multi-region).
5. **Compression is cheap** compared to network transfer. → Compress before sending over the network.

#### Rough capacity of common components

Extremely workload-dependent — use these as **starting assumptions** and say so out loud:

| Component | Rough capacity per node |
|---|---|
| Web/app server (simple API, stateless) | ~1,000–10,000 requests/s |
| Relational DB (PostgreSQL/MySQL), simple indexed reads | ~10,000+ queries/s; writes ~1,000–10,000/s |
| Redis / Memcached | ~100,000+ operations/s |
| Kafka broker | Hundreds of MB/s; hundreds of thousands of messages/s |
| Cassandra node (writes) | ~10,000+ writes/s |
| WebSocket server (mostly idle connections) | ~10,000–100,000+ concurrent connections |
| Typical server RAM | 64–512 GB (large instances go to several TB) |
| Typical server network card | 10–25 Gbps |
| NVMe SSD sequential throughput | ~2–7 GB/s |

### 5.3 The Estimation Recipe

Most estimations follow the same chain:

```mermaid
flowchart LR
    U["Users: DAU"] --> A["Actions per user per day"]
    A --> Q["Requests per day to QPS: divide by 10^5"]
    Q --> P["Peak QPS: times 2 to 3"]
    A --> S["Data per action times actions per day = storage per day"]
    S --> Y["Times 365 times years times replication"]
    Q --> B["QPS times response size = bandwidth"]
    S --> C["Hot subset of data = cache or RAM size"]
    P --> N["Peak QPS divided by per-server capacity = number of servers"]
```

- **DAU (Daily Active Users)** and **MAU (Monthly Active Users)** are the usual starting points.
- Separate **reads** and **writes** — they're usually very different (read-heavy systems have read:write ratios of 10:1 to 1000:1).

### 5.4 Worked Example: A Twitter-like Service

**Assumptions** (state them explicitly in an interview):

- 200 million DAU.
- Each user posts 2 posts/day on average.
- Each user views 100 posts/day (timeline reads).
- A post is ~1 KB including metadata (text, IDs, timestamps, index overhead).
- 10% of posts have an image of ~500 KB.
- Keep data for 5 years; replication factor 3.

**Step 1 — Write QPS**

```
Posts per day = 200M × 2 = 400M posts/day
Write QPS     = 400M / 10^5 ≈ 4,000/s   (exact: 400M / 86,400 ≈ 4,630/s)
Peak writes   ≈ 2–3× → ~10,000–15,000/s
```

**Step 2 — Read QPS**

```
Post views per day = 200M × 100 = 20B/day
Read QPS           = 20B / 10^5 = 200,000/s   (exact ≈ 231,000/s)
Peak reads         ≈ ~500,000/s
Read:write ratio   ≈ 50:1  → strongly read-heavy → caching and precomputed timelines
```

**Step 3 — Storage**

```
Text per day   = 400M × 1 KB = 400 GB/day
Text per year  = 400 GB × 365 ≈ 146 TB/year
Text, 5 years  ≈ 730 TB; with 3× replication ≈ 2.2 PB

Images per day = 400M × 10% × 500 KB = 40M × 500 KB = 20 TB/day
Images per year ≈ 7.3 PB/year  → object storage (for example S3), not a database
```

**Step 4 — Bandwidth (egress = data leaving your servers)**

```
Text egress   = 231,000 reads/s × 1 KB ≈ 231 MB/s ≈ 1.85 Gbps
Image egress: assume 10% of 20B views include an image = 2B image views/day
              2B × 500 KB = 1 PB/day ≈ 11.6 GB/s ≈ 93 Gbps
→ images must be served from a CDN
```

**Step 5 — Cache size**

Use the **80/20 rule** (Pareto principle): ~20% of the content generates ~80% of the reads.

```
Posts created in the last day = 400 GB
Cache the hottest 20%         = 80 GB
→ fits in RAM: a small Redis cluster (with replicas for availability)
```

**Step 6 — Servers**

```
Peak read QPS ≈ 500,000/s
Assume one app server handles ~5,000 req/s (mostly cache hits)
Servers ≈ 500,000 / 5,000 = 100 → add ~30% headroom → ~130 app servers
```

**What these numbers tell us about the design:**

- Read-heavy (50:1) → cache aggressively, precompute timelines ("fan-out on write," Section 15.1).
- Writes at ~10k/s peak → beyond a comfortable single relational primary for this volume → shard, or use a horizontally scalable store.
- ~2 PB of text over 5 years → must be partitioned across many machines.
- ~93 Gbps of images → CDN plus object storage.
- Hot set ~80 GB → cheap to cache in memory.

### 5.5 More Quick Examples

#### A. How much RAM for user sessions?

```
50M concurrently active users × 1 KB per session = 50 GB
→ a Redis cluster of a few nodes (64–128 GB each), plus replicas
```

#### B. How many WebSocket servers for a chat app?

```
100M DAU, 20% online at peak = 20M concurrent connections
Assume 50,000 connections per server (conservative)
Servers = 20M / 50,000 = 400 connection servers
```

#### C. How much storage for chat messages?

```
100M DAU × 40 messages/day = 4B messages/day  → ~46,000 writes/s average
4B × 200 bytes = 800 GB/day ≈ 292 TB/year (before replication)
→ write-heavy, append-only, time-ordered → a wide-column store like Cassandra fits well (Part 8)
```

#### D. How many unique short URLs can a 7-character code represent?

```
Characters: a–z, A–Z, 0–9 = 62 ("base62")
62^6 ≈ 56.8 billion
62^7 ≈ 3.5 trillion
If we create 100M URLs/month = 1.2B/year → 6B in 5 years → 7 characters give huge headroom
```

#### E. Video storage for a YouTube-like platform

```
500 hours of video uploaded per minute (a known public figure for YouTube's scale)
= 30,000 minutes of video per minute
× ~40 MB per minute at 1080p ≈ 1.2 TB per minute of wall-clock time
× ~1,440 minutes/day ≈ 1.7 PB/day for a single quality
Multiple resolutions (for adaptive streaming) roughly double or triple this
→ petabytes per day → object storage, tiered to cheaper cold storage, CDN for delivery
```

### 5.6 Estimation Tips

1. **State assumptions before calculating** — the interviewer can correct them early.
2. **Round to friendly numbers** — 86,400 → 10^5; 231,000 → 200k or 250k.
3. **Use scientific notation** to avoid zero-counting errors.
4. **Separate reads from writes**, and **average from peak**.
5. **Don't forget multipliers** — replication (×3), indexes and overhead (×1.2–2), multiple media resolutions, backups.
6. **Always say what the number means for the design** — that's the whole point.
7. **Don't overdo it** — in an interview, estimation should take ~3–5 minutes. Some interviewers skip it entirely; do the calculations that change a decision.

**Key takeaways**
- Estimation exists to drive decisions (single DB vs sharding, cache vs no cache, CDN or not).
- Per-day to per-second: divide by ~10^5. Peak ≈ 2–3× average.
- thousand/million/billion/trillion ↔ KB/MB/GB/TB when multiplying counts by bytes.
- RAM ≈ 100 ns; SSD random ≈ 100 μs; same-DC round trip ≈ 0.5 ms; cross-continent ≈ 100+ ms.
- Chain: DAU → actions → QPS → peak → storage → bandwidth → cache → servers.

---

## Part 6: Core Building Blocks — Scaling the Request Path

### 6.1 Vertical vs Horizontal Scaling

When one server can't handle the load, you have two options:

| | Vertical scaling ("scale up") | Horizontal scaling ("scale out") |
|---|---|---|
| What | Bigger machine: more CPU, RAM, faster disks | More machines sharing the load |
| Simplicity | Very simple — no code changes | Needs load balancing, stateless design, data distribution |
| Limit | Hard ceiling (largest machine available) and gets expensive fast | Practically unlimited |
| Failure | Single point of failure | Redundant — one machine dying is survivable |
| Downtime | Often needs a restart to resize | Add/remove machines live |
| Typical use | Databases early on, quick fixes | Stateless app servers, caches, distributed databases |

```mermaid
flowchart TB
    subgraph V["Vertical scaling"]
        S1["Server: 4 CPU, 16 GB"] -->|"upgrade"| S2["Server: 64 CPU, 512 GB"]
    end
    subgraph H["Horizontal scaling"]
        LB["Load Balancer"] --> A1["Server"]
        LB --> A2["Server"]
        LB --> A3["Server"]
        LB --> A4["Server"]
    end
```

**Practical wisdom:** don't dismiss vertical scaling. Modern machines are huge (hundreds of cores, terabytes of RAM). A single well-tuned PostgreSQL server can serve a surprisingly large business. Scale vertically until it's uncomfortable, then scale horizontally. But app servers should be horizontally scalable from day one — it's cheap if you keep them stateless.

### 6.2 Stateless vs Stateful Services

- A **stateless** service keeps no client-specific data between requests in its own memory. Every request carries what's needed (a token) or the data lives in a shared store (database, Redis). **Any instance can handle any request.**
- A **stateful** service keeps data in its own memory or disk that later requests depend on (an in-memory session, a WebSocket connection, a database node's data).

**Why stateless matters:** you can add or remove instances freely, a load balancer can send requests anywhere, and a crashed instance loses nothing important. **The standard pattern:** make application servers stateless and push state down into specialized stateful systems (databases, caches, queues) that are designed to be replicated and made durable.

```mermaid
flowchart LR
    C["Clients"] --> LB["Load Balancer"]
    LB --> A1["App 1: stateless"]
    LB --> A2["App 2: stateless"]
    LB --> A3["App 3: stateless"]
    A1 --> R[("Redis: sessions")]
    A2 --> R
    A3 --> R
    A1 --> D[("Database")]
    A2 --> D
    A3 --> D
```

### 6.3 Proxies: Forward Proxy vs Reverse Proxy

A **proxy** is an intermediary server that sits between clients and servers and forwards traffic. The crucial question is **whose side it's on**.

#### Forward proxy (acts on behalf of clients)

Clients send their requests to the forward proxy, which sends them to the internet. **The destination server sees the proxy, not the client.**

```mermaid
flowchart LR
    C1["Client A"] --> FP["Forward Proxy"]
    C2["Client B"] --> FP
    FP --> INT["Internet servers"]
```

Uses:
- Corporate networks: filter or log employee web access, block sites.
- Anonymity / privacy (hides client IPs), VPN-like behavior.
- Caching shared content for many clients.
- Bypassing geographic restrictions.

#### Reverse proxy (acts on behalf of servers)

Clients send requests to what looks like "the server," but it's actually a reverse proxy that forwards to one of many backend servers. **The client sees the proxy, not the backend servers.**

```mermaid
flowchart LR
    INT["Clients on the internet"] --> RP["Reverse Proxy"]
    RP --> B1["Backend 1"]
    RP --> B2["Backend 2"]
    RP --> B3["Backend 3"]
```

Uses:
- **Load balancing** across backends.
- **TLS termination** (handles HTTPS so backends don't have to).
- **Caching** responses and serving static files.
- **Compression** (gzip, Brotli).
- **Security**: hides backend topology and IPs; single place for a **WAF (Web Application Firewall)** and DDoS protection.
- **Routing**: `/api/*` to API servers, `/static/*` to file servers.

Popular reverse proxies: **Nginx**, **HAProxy**, **Envoy**, **Traefik**, **Caddy**. Cloud load balancers and CDNs are also reverse proxies.

**Memory aid:** a forward proxy hides the **clients**; a reverse proxy hides the **servers**.

### 6.4 Load Balancers

A **load balancer (LB)** distributes incoming traffic across multiple servers so no single one is overwhelmed. It's a specialized reverse proxy and the cornerstone of horizontal scaling.

What a load balancer gives you:

1. **Scalability** — add servers behind it.
2. **Availability** — **health checks** detect dead servers and stop sending them traffic.
3. **Zero-downtime deployments** — drain and replace servers one at a time.
4. **A single stable entry point** — clients know one address.

#### L4 vs L7 load balancers

| | Layer 4 (transport) | Layer 7 (application) |
|---|---|---|
| Sees | IP addresses and ports (TCP/UDP) | Full HTTP request: URL, headers, cookies, body |
| Routing decisions | Based on IP/port only | Content-based: `/api` vs `/images`, by header, by user |
| Speed | Faster, less CPU | Slower (must parse HTTP, often terminate TLS) |
| TLS | Passes encrypted traffic through (usually) | Terminates TLS to inspect content |
| Features | Simple, protocol-agnostic | Path routing, header rewrites, caching, auth, retries, sticky sessions via cookies |
| Examples | AWS NLB (Network Load Balancer), HAProxy in TCP mode | AWS ALB (Application Load Balancer), Nginx, Envoy |

**Rule of thumb:** use L7 for HTTP services when you need smart routing (the common case); use L4 for raw performance, non-HTTP protocols (databases, game servers), or long-lived TCP connections.

#### Load balancing algorithms

| Algorithm | How it works | Good for |
|---|---|---|
| **Round robin** | Send to servers in turn: 1, 2, 3, 1, 2, 3... | Identical servers, similar requests |
| **Weighted round robin** | Servers with higher weight get more requests | Mixed server sizes |
| **Least connections** | Send to the server with the fewest active connections | Long or variable request durations, WebSockets |
| **Least response time** | Send to the fastest-responding server | Heterogeneous performance |
| **IP hash** | Hash of client IP decides the server | Simple stickiness without cookies |
| **Consistent hashing** | Hash of a key (user ID, cache key) on a ring (Section 9.4) | Caches and stateful services, minimal reshuffling when servers change |
| **Random / power of two choices** | Pick two random servers, send to the less loaded one | Large fleets; surprisingly effective and simple |

#### Health checks

The LB periodically calls something like `GET /health` on each server. If a server fails N checks in a row, it's removed from rotation; when it passes again, it's added back.

- **Liveness check**: "is the process alive?"
- **Readiness check**: "is it ready to take traffic?" (for example, finished warming up, connected to the database).

#### Sticky sessions (session affinity)

The LB sends all requests from the same client to the same server (using a cookie or IP hash). Needed when a server holds client state in memory (legacy session storage, some WebSocket setups).

- **Downside:** uneven load, and if that server dies, the client's state is lost.
- **Better:** make servers stateless and keep state in a shared store; use stickiness only when unavoidable.

#### Isn't the load balancer a single point of failure?

Yes, if there's only one. A **SPOF (Single Point Of Failure)** is any component whose failure brings the whole system down. Solutions:

- Run LBs in **pairs** (active-passive with a floating/virtual IP that moves on failure, or active-active).
- Managed cloud load balancers are internally redundant across availability zones.
- At global scale, use **DNS-based load balancing / GeoDNS** or **anycast** (the same IP announced from many locations; the network routes users to the nearest one) in front of regional load balancers.

```mermaid
flowchart TB
    U["Users worldwide"] --> DNS["GeoDNS or Anycast"]
    DNS --> LB1["Regional LB: Europe"]
    DNS --> LB2["Regional LB: US"]
    LB1 --> E1["App servers EU"]
    LB2 --> U1["App servers US"]
```

### 6.5 API Gateway

An **API gateway** is a reverse proxy specialized for APIs — a single entry point that handles **cross-cutting concerns** so individual services don't each have to implement them.

Typical responsibilities:

- **Request routing** — `/users/*` → user service, `/orders/*` → order service.
- **Authentication and authorization** — validate JWTs or API keys once, at the edge.
- **Rate limiting and quotas** — per user, per API key.
- **TLS termination.**
- **Request/response transformation** — protocol translation (REST ↔ gRPC), header manipulation.
- **Aggregation** — combine several backend calls into one response.
- **Observability** — logging, metrics, tracing for every request.
- **Caching** of responses.

```mermaid
flowchart LR
    M["Mobile app"] --> GW["API Gateway: auth, rate limit, routing"]
    W["Web app"] --> GW
    P["Partner systems"] --> GW
    GW --> US["User Service"]
    GW --> OS["Order Service"]
    GW --> PS["Payment Service"]
```

Examples: AWS API Gateway, Kong, Apigee, Azure API Management, Envoy-based gateways.

#### Reverse proxy vs load balancer vs API gateway

These overlap heavily; the names emphasize different primary purposes:

| | Reverse proxy | Load balancer | API gateway |
|---|---|---|---|
| Primary job | Stand in front of servers (generic) | Distribute traffic across identical instances | Manage and secure APIs for many services |
| Routes to | One or many backends | Instances of the **same** service | **Different** services |
| Typical features | TLS, caching, compression, static files | Algorithms, health checks | Auth, rate limiting, API keys, transformations, aggregation |
| Examples | Nginx, Envoy | AWS ALB/NLB, HAProxy | Kong, AWS API Gateway |

**How they're often combined:**

```mermaid
flowchart LR
    C["Client"] --> CDN["CDN"]
    CDN --> GW["API Gateway"]
    GW --> LB1["Load Balancer"]
    LB1 --> S1["User service instance 1"]
    LB1 --> S2["User service instance 2"]
    GW --> LB2["Load Balancer"]
    LB2 --> O1["Order service instance 1"]
    LB2 --> O2["Order service instance 2"]
```

In an interview, drawing "Client → API Gateway / Load Balancer → Services" as one box is usually fine unless the distinction matters.

#### BFF: Backend For Frontend

A variant where each client type (web, mobile) gets its own thin gateway tailored to its needs, aggregating calls to backend services. Reduces chattiness for mobile and lets frontend teams move independently. GraphQL is often used this way.

### 6.6 CDN: Content Delivery Network

A **CDN** is a geographically distributed network of **edge servers** (in locations called **PoPs — Points of Presence**) that cache content close to users.

```mermaid
flowchart TB
    O["Origin server or S3 bucket in US"]
    E1["Edge: Frankfurt"] -->|"cache miss only"| O
    E2["Edge: Tokyo"] -->|"cache miss only"| O
    E3["Edge: Sao Paulo"] -->|"cache miss only"| O
    U1["User in Germany"] --> E1
    U2["User in Japan"] --> E2
    U3["User in Brazil"] --> E3
```

**Why:** a user in Tokyo fetching an image from a US server pays ~150 ms per round trip; from a Tokyo edge server, ~5–20 ms. The CDN also absorbs huge traffic volumes (Part 5's 93 Gbps of images) and shields the origin.

#### What CDNs serve

- **Static content**: images, videos, CSS, JavaScript, fonts, downloadable files — the classic use.
- **Video streaming**: segments of video files (HLS/DASH, Section 15.2).
- **Dynamic content acceleration**: even uncacheable requests benefit from the CDN's optimized network and persistent connections to the origin.
- **Edge compute**: running small functions at the edge (Cloudflare Workers, Lambda@Edge).
- **Security**: DDoS absorption, WAF.

#### Pull vs push CDNs

| | Pull CDN | Push CDN |
|---|---|---|
| How | On first request (cache miss), the edge fetches from origin, then caches | You upload content to the CDN ahead of time |
| Pros | Easy; only popular content is cached | Full control; no first-request slowness |
| Cons | First user in each region is slow | You manage uploads and storage |
| Good for | Most websites, high-traffic content | Large files that rarely change, predictable content |

#### Cache control and invalidation

- Content is cached for a **TTL** controlled by `Cache-Control` headers.
- To update content: **invalidate/purge** it (slow-ish, sometimes costly), or better, use **versioned URLs** (`app.3f9a2c.js`, `image.jpg?v=7`) so new content has a new URL and old caches simply age out. Versioned URLs are the standard best practice for static assets.
- Private content: **signed URLs** (URLs containing an expiring signature) let the CDN serve content only to authorized users.

**Key takeaways**
- Scale vertically for simplicity, horizontally for limitless scale and redundancy. Keep app servers stateless.
- Forward proxy hides clients; reverse proxy hides servers.
- Load balancers: L4 (IP/port, fast) vs L7 (HTTP-aware, smart routing). Know round robin, least connections, consistent hashing, health checks.
- API gateway = single entry point for auth, rate limiting, routing to *different* services.
- CDN = cache content at edge locations near users; use versioned URLs for invalidation.

---

## Part 7: Caching

**Caching** means storing a copy of data in a faster place so future requests can be served quicker. It's the single most effective performance tool in system design — and a source of subtle bugs.

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

### 7.1 Why Cache?

- **Lower latency** — RAM (~100 ns) vs a database query over the network (~1–10 ms).
- **Higher throughput / lower load** — a cache hit never touches the database; protects it from being overwhelmed.
- **Lower cost** — fewer database resources, less bandwidth.

Caching works because of **locality**: a small fraction of data is requested far more often than the rest (a viral post, a celebrity profile, today's home page).

**Key metric — cache hit ratio:** `hits / (hits + misses)`. A 95% hit ratio means only 5% of reads reach the database: a 20× load reduction.

### 7.2 Where Caches Live

Caches exist at every layer of the request path:

```mermaid
flowchart LR
    B["Browser cache"] --> CDN["CDN edge cache"]
    CDN --> RP["Reverse proxy or gateway cache"]
    RP --> APP["App: in-process memory cache"]
    APP --> DC["Distributed cache: Redis or Memcached"]
    DC --> DB["Database: buffer pool and query cache"]
```

| Layer | Example | Notes |
|---|---|---|
| Client / browser | HTTP cache, `localStorage`, mobile app cache | Controlled by `Cache-Control`, `ETag` |
| CDN | CloudFront, Cloudflare, Akamai | Static and some dynamic content |
| Reverse proxy / API gateway | Nginx cache, Varnish | Whole HTTP responses |
| Application (in-process) | A `Map` in Node.js memory, an LRU cache library | Fastest (no network), but per-instance, not shared, lost on restart |
| Distributed cache | **Redis**, **Memcached** | Shared by all app instances; the usual meaning of "add a cache" in interviews |
| Database | Buffer pool (cached pages), materialized views | Built in |

### 7.3 Caching Strategies (Read and Write Patterns)

#### Cache-aside (lazy loading) — the most common

The **application** manages the cache explicitly.

```mermaid
sequenceDiagram
    participant App
    participant Cache
    participant DB
    App->>Cache: GET user:42
    alt cache hit
        Cache-->>App: data
    else cache miss
        Cache-->>App: null
        App->>DB: SELECT user 42
        DB-->>App: data
        App->>Cache: SET user:42 data with TTL
    end
```

```typescript
async function getUser(id: string): Promise<User> {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached); // cache hit

  const user = await db.users.findById(id); // cache miss: go to DB
  await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 300); // cache for 5 minutes
  return user;
}

async function updateUser(id: string, changes: Partial<User>): Promise<void> {
  await db.users.update(id, changes);
  await redis.del(`user:${id}`); // invalidate; next read repopulates
}
```

- **Pros:** only requested data is cached; cache failure isn't fatal (fall back to DB); simple.
- **Cons:** first request is slow (miss); possible stale data between DB write and invalidation.
- **On writes:** usually **delete** the cache key rather than update it (avoids race conditions where two concurrent writers leave the cache with the older value).

#### Read-through

Like cache-aside, but the **cache itself** loads from the database on a miss (the app only talks to the cache). Common with caching libraries or managed services. Same trade-offs, cleaner app code.

#### Write-through

Writes go to the cache **and** the database synchronously, as one operation.

- **Pros:** cache is always fresh; reads after writes are fast.
- **Cons:** higher write latency (two writes); caches data that may never be read.

#### Write-behind (write-back)

Writes go to the cache only; the cache **asynchronously** flushes to the database later (batched).

- **Pros:** very fast writes; batching reduces DB load. Great for high-frequency counters (views, likes).
- **Cons:** **risk of data loss** if the cache crashes before flushing; more complex.

#### Write-around

Writes go directly to the database, bypassing the cache; the cache is filled only on reads (usually combined with cache-aside).

- **Pros:** avoids polluting the cache with data that's written but rarely read (logs, bulk imports).
- **Cons:** a read right after a write is a miss.

#### Summary

| Strategy | Write path | Read path | Consistency | Best for |
|---|---|---|---|---|
| Cache-aside | DB, then invalidate cache | App checks cache, loads DB on miss | Eventual (small stale window) | General-purpose default |
| Read-through | DB (plus invalidate) | Cache loads DB on miss | Eventual | Cleaner cache-aside |
| Write-through | Cache + DB synchronously | Cache | Strong-ish | Read-after-write heavy |
| Write-behind | Cache, async to DB | Cache | Risk of loss | Write-heavy counters, metrics |
| Write-around | DB only | Cache-aside | Eventual | Write-once, read-rarely data |

### 7.4 Eviction Policies

Caches have limited memory. When full, which item gets removed?

| Policy | Evicts | Notes |
|---|---|---|
| **LRU (Least Recently Used)** | Item not accessed for the longest time | Most common default; good for most workloads |
| **LFU (Least Frequently Used)** | Item accessed the fewest times | Better when popularity is stable; slower to adapt to new trends |
| **FIFO (First In, First Out)** | Oldest inserted item | Simple, usually worse |
| **TTL-based expiry** | Items past their time-to-live | Not strictly eviction, but key for freshness |
| **Random** | A random item | Surprisingly OK, cheap |

(Implementing an LRU cache with a hash map + doubly linked list is also a classic coding interview question: LeetCode 146.)

### 7.5 Cache Invalidation and Consistency

The cache is a copy; copies go stale. Your options:

1. **TTL (time-based expiry)** — accept data up to N seconds stale. Simple and robust. Choose TTL by how stale the data may be: stock prices (seconds), product descriptions (hours), static assets (forever with versioned URLs).
2. **Explicit invalidation** — delete/update cache entries on writes (cache-aside's delete).
3. **Event-driven invalidation** — database changes are published as events (via **CDC — Change Data Capture**, Section 11.7), and a consumer invalidates affected keys. Works across services.
4. **Versioned keys** — include a version in the key (`user:42:v7`); bump the version on change.

**Always combine explicit invalidation with a TTL** as a safety net: if an invalidation is ever missed, the stale entry expires eventually.

**Ask the right question:** "How stale can this data be?" Your follower count can be a minute old; your bank balance on the payment screen cannot. Don't cache data that must be strongly consistent, or cache it with very short TTLs and read from the source for critical operations.

### 7.6 Classic Caching Problems

#### Cache stampede (thundering herd / dog-piling)

A very popular key expires. Thousands of concurrent requests miss at the same moment and all hit the database to recompute it → the database collapses.

Solutions:
- **Request coalescing / locking**: only one request recomputes (acquires a lock, for example with Redis `SET key NX`); others wait or serve the stale value.
- **Early (probabilistic) refresh**: refresh the value *before* it expires, in the background.
- **Stale-while-revalidate**: serve the stale value while one worker refreshes it.

#### Cache penetration

Requests for keys that **don't exist** (for example, random IDs from an attacker) always miss the cache and hit the database.

Solutions:
- **Cache negative results** ("user 999 not found") with a short TTL.
- **Bloom filter** in front (Section 14.1): quickly answers "this key definitely doesn't exist."

#### Cache avalanche

Many keys expire **at the same time** (for example, all set with a 1-hour TTL after a deploy), or the cache cluster goes down → massive load spike on the database.

Solutions:
- **Add random jitter to TTLs** (for example 3,600 ± 300 seconds).
- Highly available cache cluster (replicas), **circuit breakers** and rate limiting to protect the database (Part 13).
- **Cache warming**: pre-populate the cache before sending traffic.

#### Hot keys

One key gets enormous traffic (a celebrity's profile, a viral post) and overloads the single cache node that holds it.

Solutions:
- **Replicate hot keys** across multiple nodes (`post:123#1`, `post:123#2`, ... and read from a random copy).
- **Local in-process cache** for the hottest keys in front of Redis.

### 7.7 Redis vs Memcached

| | Redis | Memcached |
|---|---|---|
| Data types | Strings, hashes, lists, sets, **sorted sets**, streams, bitmaps, HyperLogLog, geospatial | Strings (blobs) only |
| Persistence | Optional (RDB snapshots, AOF — append-only file) | None (pure cache) |
| Replication / high availability | Yes (replicas, Sentinel, Redis Cluster) | No built-in replication |
| Threading | Mostly single-threaded command execution (I/O threads optional) | Multi-threaded |
| Extras | Pub/Sub, Lua scripting, transactions, TTL per key, streams | Simple and very fast |
| Typical use | Cache **plus** leaderboards, rate limiters, sessions, queues, locks, counters | Pure, simple, large key-value cache |

**Default in interviews:** Redis, because its data structures solve many problems directly — for example, a **sorted set** is a ready-made leaderboard (`ZADD`, `ZREVRANGE`), `INCR` with `EXPIRE` is a basic rate limiter, and `SET key value NX EX 30` is a simple lock.

**Key takeaways**
- Caching trades freshness for speed. Always ask "how stale can this be?"
- Cache-aside (lazy loading, delete on write) is the default pattern. Write-through for freshness, write-behind for write-heavy workloads (with loss risk).
- LRU is the default eviction policy. Always use TTLs as a safety net.
- Know the failure modes: stampede (coalesce), penetration (negative caching, Bloom filter), avalanche (TTL jitter), hot keys (replicate).
- Redis is the go-to distributed cache and a Swiss-army knife (sorted sets, counters, locks, pub/sub).

---

## Part 8: Databases and Storage

Choosing and modeling storage is the heart of most system designs. This part explains every major category of database, how they work inside, and — most importantly — **when to choose which**.

### 8.1 The Big Picture: Kinds of Storage

| Category | Stores | Examples |
|---|---|---|
| **Relational (SQL)** | Tables of rows with a fixed schema, related by keys | PostgreSQL, MySQL, Oracle, SQL Server |
| **Key-value** | Values looked up by a unique key | Redis, DynamoDB, Memcached, etcd, RocksDB |
| **Document** | JSON-like documents | MongoDB, Couchbase, Firestore |
| **Wide-column** | Rows grouped by partition key, sorted by clustering key, flexible columns | Cassandra, ScyllaDB, HBase, Google Bigtable |
| **Graph** | Nodes and edges (relationships) | Neo4j, Amazon Neptune |
| **Time-series** | Timestamped measurements | InfluxDB, TimescaleDB, Prometheus |
| **Search engine** | Inverted index over text | Elasticsearch, OpenSearch, Solr |
| **Columnar / data warehouse (OLAP)** | Columns stored together, for analytics | Snowflake, BigQuery, Redshift, ClickHouse |
| **Object / blob storage** | Large files (binary objects) | Amazon S3, Google Cloud Storage, Azure Blob |
| **Vector database** | Embeddings for similarity search | pgvector, Pinecone, Milvus, Weaviate |

"**NoSQL**" ("Not only SQL") is an umbrella term for the non-relational categories. They generally trade some relational features (joins, strict schemas, multi-row transactions) for **easier horizontal scaling, flexible schemas, or specialized access patterns**.

A quick note on the word **"tabular"**: relational databases are the classic tabular databases (data in tables of rows and columns). Wide-column stores like Bigtable are also sometimes described as tables, but they behave very differently (no joins, access by partition key). When someone says "tabular," confirm which they mean.

### 8.2 Relational Databases (RDBMS)

An **RDBMS (Relational Database Management System)** stores data in **tables** (relations) made of **rows** (records) and **columns** (attributes), with a **schema** defined upfront. You query with **SQL (Structured Query Language)**.

#### Keys and relationships

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : "appears in"
    USERS {
        bigint id PK
        string email
        string name
    }
    ORDERS {
        bigint id PK
        bigint user_id FK
        timestamp created_at
        string status
    }
    ORDER_ITEMS {
        bigint order_id FK
        bigint product_id FK
        int quantity
    }
    PRODUCTS {
        bigint id PK
        string name
        decimal price
    }
```

- **Primary key (PK)** — uniquely identifies a row (`users.id`).
- **Foreign key (FK)** — a column referencing another table's primary key (`orders.user_id → users.id`). The database can enforce **referential integrity** (no order pointing to a non-existent user).
- Relationship types: **one-to-one**, **one-to-many** (a user has many orders), **many-to-many** (orders ↔ products via the `order_items` **join table**).

#### Joins

A **join** combines rows from multiple tables in one query:

```sql
SELECT u.name, o.id, o.created_at
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.id = 42
ORDER BY o.created_at DESC;
```

Joins are the superpower of relational databases: you store each fact once and combine it flexibly at query time — even for queries you didn't anticipate when designing the schema.

#### Normalization vs denormalization

**Normalization** means organizing tables so each fact is stored **exactly once**, avoiding duplication and update anomalies. The common levels:

- **1NF (First Normal Form)**: each cell holds a single value (no lists in a column).
- **2NF (Second Normal Form)**: every non-key column depends on the *whole* primary key.
- **3NF (Third Normal Form)**: non-key columns depend *only* on the key, not on other non-key columns. (A customer's city shouldn't be stored on every order row.)

**Denormalization** means intentionally duplicating data to make reads faster (avoiding joins). Example: storing `author_name` directly on each post so the feed query doesn't need to join the users table.

| | Normalized | Denormalized |
|---|---|---|
| Duplication | None | Some |
| Writes | Simple, update one place | Must update all copies (risk of inconsistency) |
| Reads | May need joins (slower at scale) | Fast, fewer joins |
| Typical in | OLTP relational systems, sources of truth | Read-heavy systems, NoSQL, caches, analytics |

**Rule of thumb:** normalize your source of truth; denormalize for read performance where measurements prove it's needed.

#### ACID transactions

A **transaction** groups several operations so they succeed or fail **as a unit**. Classic example — transfer $100 from Alice to Bob:

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 'alice';
UPDATE accounts SET balance = balance + 100 WHERE id = 'bob';
COMMIT;
```

Relational databases guarantee **ACID** properties:

| Letter | Property | Meaning | In the transfer example |
|---|---|---|---|
| **A** | **Atomicity** | All operations happen, or none do | Never debit Alice without crediting Bob |
| **C** | **Consistency** | Transaction takes the DB from one valid state to another (constraints hold) | Balance can't go negative if a constraint forbids it |
| **I** | **Isolation** | Concurrent transactions don't interfere as if run one at a time (to a configurable degree) | Two simultaneous transfers don't corrupt balances |
| **D** | **Durability** | Once committed, data survives crashes | After "success," a power outage won't undo it |

(Note: the "C" in ACID is **not** the same as the "C" in CAP. More in Part 10.)

**Durability** is typically implemented with a **WAL (Write-Ahead Log)**: before changing data files, the database appends the change to a sequential log on disk. After a crash, it replays the log.

#### When relational databases shine

- Data is **structured and relational** (users, orders, products, payments).
- You need **transactions** and strong consistency (money, inventory, bookings).
- You need **flexible, ad-hoc queries** and joins you can't fully predict.
- Most business applications — **the default choice** when requirements don't clearly point elsewhere.

**Scaling limits:** writes are usually handled by a single primary node. You scale reads with replicas and writes with vertical scaling, then sharding (Part 9) — which sacrifices easy joins and cross-shard transactions. **NewSQL / distributed SQL** databases (Google Spanner, CockroachDB, YugabyteDB, TiDB) offer SQL and ACID transactions while scaling horizontally, at the cost of higher write latency and complexity.

### 8.3 Transactions in Depth: Isolation Levels and Concurrency Control

This is a frequent senior-level deep-dive, especially for booking, inventory, and payment systems.

#### Concurrency anomalies

| Anomaly | What happens | Example |
|---|---|---|
| **Dirty read** | You read another transaction's **uncommitted** changes, which may be rolled back | You see a balance that never actually existed |
| **Non-repeatable read** | You read the same row twice and get different values (someone committed in between) | Price changes during your checkout transaction |
| **Phantom read** | You run the same query twice and new rows appear/disappear | "Count bookings for room 5 tonight" returns 0, then 1 |
| **Lost update** | Two transactions read-modify-write the same value; one overwrites the other | Two users increment a counter from 10; result is 11, not 12 |
| **Write skew** | Two transactions read overlapping data, make decisions, and write different rows, violating a rule together | Two doctors both go off-call because each saw the other was on call |

#### Isolation levels (SQL standard)

| Level | Prevents | Notes |
|---|---|---|
| **Read Uncommitted** | Nothing much | Allows dirty reads; almost never used |
| **Read Committed** | Dirty reads | **Default in PostgreSQL**, Oracle, SQL Server |
| **Repeatable Read** | + non-repeatable reads (and, in practice, phantoms in PostgreSQL's snapshot implementation) | **Default in MySQL InnoDB** |
| **Serializable** | All anomalies — behaves as if transactions ran one at a time | Safest; slowest; may abort transactions that must be retried |

Stronger isolation = fewer bugs but lower concurrency and more aborted transactions.

#### MVCC: Multi-Version Concurrency Control

Most modern databases (PostgreSQL, MySQL InnoDB, Oracle) use **MVCC**: instead of overwriting rows, they keep multiple versions. Each transaction sees a consistent **snapshot** of the data as of when it started. Result: **readers don't block writers and writers don't block readers.** This is how **snapshot isolation** is implemented.

#### Pessimistic vs optimistic locking

Two ways to prevent lost updates and double-booking:

**Pessimistic locking** — "assume conflict; lock first."

```sql
BEGIN;
SELECT * FROM seats WHERE id = 'A12' FOR UPDATE;  -- locks the row
-- check it's available, then:
UPDATE seats SET status = 'booked', user_id = 42 WHERE id = 'A12';
COMMIT;
```

Other transactions trying to lock `A12` wait. Safe and simple, but locks reduce concurrency and can cause **deadlocks** (two transactions each waiting for the other's lock — databases detect these and abort one).

**Optimistic locking (OCC — Optimistic Concurrency Control)** — "assume no conflict; detect it at write time" using a version number:

```sql
-- Read: seat A12, status = 'available', version = 7
UPDATE seats
SET status = 'booked', user_id = 42, version = version + 1
WHERE id = 'A12' AND version = 7;
-- If 0 rows were updated, someone else changed it first → retry or fail
```

| | Pessimistic | Optimistic |
|---|---|---|
| Assumes | Conflicts are common | Conflicts are rare |
| Mechanism | Locks (`SELECT ... FOR UPDATE`) | Version/timestamp check on write |
| Under low contention | Unnecessary overhead | Fast |
| Under high contention | Waiting, but predictable | Many retries (wasted work) |
| Example | Last few seats of a hot concert | Editing a user profile, wiki pages |

A related trick is the **conditional atomic update**: `UPDATE inventory SET stock = stock - 1 WHERE product_id = 7 AND stock > 0;` — the database does the check and the write atomically in one statement.

### 8.4 Key-Value Stores

The simplest model: a giant, distributed **hash map**. `put(key, value)`, `get(key)`, `delete(key)`. The database doesn't care what's inside the value.

```
"session:8f2a..."   → {"userId": 42, "expires": 1735689600}
"cart:user:42"      → [{"sku": "A1", "qty": 2}]
"feature:new-ui"    → "enabled"
"rate:ip:1.2.3.4"   → 17
```

**Strengths:**
- **Extremely fast** lookups by key (O(1)), often sub-millisecond.
- **Scales horizontally** trivially: hash the key to pick a node.
- Simple mental model.

**Weaknesses:**
- You can only efficiently query **by key**. "Find all sessions of users in Germany" is not possible without scanning everything (or building your own secondary indexes).
- No joins, limited or no multi-key transactions (varies).

**Choose key-value when:**
- Access is **always by a known key**: sessions, user preferences, shopping carts, feature flags, tokens.
- You need a **cache** (Redis, Memcached).
- You need **counters, rate limiters, leaderboards** (Redis data structures).
- You need **massive scale with simple access patterns** (DynamoDB).
- You need **configuration / coordination** data with strong consistency (etcd, ZooKeeper — used by Kubernetes).

**Note on DynamoDB:** it's a key-value *and* document store. Items have a **partition key** (decides which partition stores the item) and optional **sort key** (orders items within a partition), enabling queries like "all orders of user 42 sorted by date." It offers predictable single-digit-millisecond latency at any scale, if you design around your access patterns.

### 8.5 Document Databases

Store data as **documents**, usually JSON or BSON (binary JSON), grouped into **collections**. Documents in the same collection can have **different fields** (flexible schema).

```json
{
  "_id": "prod_123",
  "name": "Mechanical Keyboard",
  "price": 89.99,
  "category": "electronics",
  "specs": { "switches": "brown", "layout": "TKL", "backlight": true },
  "tags": ["keyboard", "mechanical", "gaming"],
  "reviews": [
    { "user": "ada", "rating": 5, "text": "Great!" }
  ]
}
```

**Strengths:**
- **Flexible schema** — add fields without migrations; different items can have different attributes (a TV has `screenSize`, a shirt has `size` and `color`).
- **Data locality** — related data nested in one document is fetched in **one read** (no joins). Maps naturally to objects in TypeScript code.
- Rich queries and **secondary indexes** on any field (unlike pure key-value).
- Horizontal scaling via sharding (built into MongoDB).

**Weaknesses:**
- Joins are limited or expensive (MongoDB has `$lookup`, but it's not the model's strength).
- Many-to-many relationships are awkward; data duplication leads to consistency work.
- Unbounded nested arrays (all comments of a viral post inside the post document) grow documents too large.
- Multi-document transactions exist in modern MongoDB, but are costlier than in relational databases.

**Choose document databases when:**
- Data is **self-contained aggregates** usually read as a whole: product catalogs, user profiles, CMS (Content Management System) articles, game state.
- Schema varies across records or evolves rapidly.
- Relationships between aggregates are few.

**Modeling rule — embed vs reference:**
- **Embed** when data is read together and bounded in size (an order's line items, a user's addresses).
- **Reference** (store IDs) when data is large, unbounded, shared, or updated independently (comments on a viral post, authors shared by many books).

### 8.6 Wide-Column Stores

**Wide-column stores** (Cassandra, ScyllaDB, HBase, Bigtable) organize data into tables where each row is identified by a **partition key**, and within a partition, rows are **sorted by clustering columns**. They're built for **massive write throughput** and **horizontal scale** across many nodes, often across data centers.

The key idea: **data is grouped and sorted on disk exactly the way you'll query it.**

Example: chat messages in Cassandra.

```sql
CREATE TABLE messages (
  chat_id     uuid,
  sent_at     timeuuid,
  sender_id   uuid,
  body        text,
  PRIMARY KEY ((chat_id), sent_at)
) WITH CLUSTERING ORDER BY (sent_at DESC);
```

- `chat_id` is the **partition key** → all messages of one chat live together on the same nodes.
- `sent_at` is the **clustering key** → messages are stored sorted by time within the partition.
- The query "latest 50 messages in chat X" becomes a single sequential read from one partition — extremely fast at any scale.

```
Partition: chat_id = 7f3a...
  sent_at (desc)         sender_id   body
  2026-09-26 10:05:12    u_42        "See you soon"
  2026-09-26 10:04:55    u_17        "On my way"
  2026-09-26 10:01:03    u_42        "Where are you?"
  ...
```

**Strengths:**
- **Huge write throughput** (LSM-tree storage, Section 8.13), linear horizontal scaling: double the nodes, roughly double the capacity.
- **High availability**, no single leader (Cassandra is leaderless, Section 9.1), multi-data-center replication, **tunable consistency** (Section 10.4).
- Efficient range scans within a partition (time-ordered data).

**Weaknesses:**
- **Query-driven modeling**: you design one table per query pattern, often duplicating data. Queries not planned for (for example "all messages containing 'hello'") are impractical.
- No joins, limited secondary indexes, limited transactions (lightweight transactions exist but are slow).
- **Hot partitions** if the partition key is poorly chosen (one giant chat, one celebrity).
- Eventual consistency by default.

**Choose wide-column when:**
- **Write-heavy, huge-volume** data: messaging, activity feeds, event logs, IoT sensor data, click streams.
- Access patterns are **known and stable** (always by partition key, often by time range).
- You need multi-region availability and can accept eventual consistency.

(Discord famously stored trillions of messages on Cassandra and later moved to ScyllaDB — same model.)

### 8.7 Graph Databases

Store **nodes** (entities) and **edges** (relationships), both with properties. Relationships are first-class and traversing them is fast, regardless of total data size.

```mermaid
flowchart LR
    A["Alice"] -->|"FOLLOWS"| B["Bob"]
    B -->|"FOLLOWS"| C["Carol"]
    A -->|"LIKES"| P["Post 1"]
    C -->|"WROTE"| P
    B -->|"WORKS_AT"| X["Acme Inc"]
```

Query (Cypher, Neo4j's language): "friends of friends of Alice she doesn't already follow":

```
MATCH (a:User {name:'Alice'})-[:FOLLOWS]->()-[:FOLLOWS]->(fof)
WHERE NOT (a)-[:FOLLOWS]->(fof) AND fof <> a
RETURN fof
```

In SQL, this requires multiple self-joins that get slower with each hop; in a graph DB, each hop is a cheap pointer traversal.

**Choose graph databases when:** relationships *are* the data and you traverse many hops — social networks (mutual friends, suggestions), recommendation engines, fraud detection (rings of connected accounts), knowledge graphs, network/IT topology, access control graphs.

**Caveat:** many "social" system design problems (Twitter followers) are still commonly modeled with relational or wide-column tables because the queries are simple (one hop: "who does X follow?") and scale matters more. Reach for a graph DB when multi-hop traversal is central.

### 8.8 Time-Series Databases

Optimized for **timestamped data points** appended in time order: `(metric, tags, timestamp, value)`.

```
cpu_usage{host="web-1", region="eu"}  2026-09-26T10:00:00Z  0.63
cpu_usage{host="web-1", region="eu"}  2026-09-26T10:00:10Z  0.71
```

Features: very high ingest rates, compression of similar consecutive values, **downsampling** (keep per-second data for a week, per-minute for a year), **retention policies** (auto-delete old data), time-window aggregation functions.

**Choose time-series when:** metrics and monitoring (Prometheus, InfluxDB), IoT sensor data, financial tick data, application performance data. (TimescaleDB is a PostgreSQL extension — a good pragmatic choice.)

### 8.9 Search Engines

**Elasticsearch / OpenSearch** (built on Apache Lucene) are optimized for **full-text search**: "find products matching 'wireles keybord'" with typo tolerance, relevance ranking, filters, facets, and autocomplete.

The core data structure is the **inverted index** (Section 14.6): a map from each word to the list of documents containing it — like the index at the back of a book.

```
"keyboard" → [doc1, doc4, doc9]
"wireless" → [doc4, doc7]
Query "wireless keyboard" → intersect → [doc4]
```

**Choose a search engine when:** full-text search, fuzzy matching, relevance ranking, faceted filtering (e-commerce filters), log search and analysis (the ELK stack: Elasticsearch, Logstash, Kibana).

**Important pattern:** a search engine is usually **not the source of truth**. The primary database holds the data; changes are streamed (often via CDC or a queue) into Elasticsearch for searching. The search index is **eventually consistent** with the database.

```mermaid
flowchart LR
    APP["App"] -->|"writes"| DB[("Primary DB")]
    DB -->|"CDC or events"| Q["Queue"]
    Q --> IDX["Indexer"]
    IDX --> ES[("Elasticsearch")]
    APP -->|"search queries"| ES
```

### 8.10 OLTP vs OLAP: Analytical Databases and Data Warehouses

Two very different workloads:

| | OLTP (Online Transaction Processing) | OLAP (Online Analytical Processing) |
|---|---|---|
| Purpose | Run the application | Analyze the business |
| Queries | Many small reads/writes by key ("get order 42") | Few huge scans and aggregations ("revenue by country per month for 3 years") |
| Rows touched per query | Few | Millions to billions |
| Users | End users via the app | Analysts, dashboards, data scientists |
| Storage layout | **Row-oriented** | **Column-oriented** |
| Examples | PostgreSQL, MySQL, DynamoDB | Snowflake, BigQuery, Redshift, ClickHouse, Apache Druid |

**Row vs column storage:**

```
Row-oriented (OLTP): each row stored together
[42, "Alice", "DE", 120.50] [43, "Bob", "US", 80.00] [44, "Carol", "DE", 45.10]

Column-oriented (OLAP): each column stored together
id:      [42, 43, 44]
name:    ["Alice", "Bob", "Carol"]
country: ["DE", "US", "DE"]
amount:  [120.50, 80.00, 45.10]
```

`SELECT SUM(amount) WHERE country = 'DE'` only needs to read two columns in columnar storage — skipping everything else — and similar values in a column compress extremely well. That's why analytics databases are columnar.

Data typically flows from OLTP databases into the warehouse via **ETL (Extract, Transform, Load)** or **ELT** pipelines, or via streaming. A **data lake** stores raw files (often Parquet, a columnar file format) in object storage for later processing.

**In interviews:** if the problem includes "analytics," "dashboards," "reports," or "metrics over time," say you'd stream events into a separate analytical store rather than run heavy aggregation queries on your production OLTP database.

### 8.11 Object (Blob) Storage

**Object storage** (Amazon S3, Google Cloud Storage, Azure Blob Storage) stores **large, unstructured binary files** — **BLOBs (Binary Large Objects)**: images, videos, audio, backups, logs, documents, ML model files.

- Flat namespace: **buckets** containing **objects** identified by a key (`uploads/user42/avatar.jpg`).
- Virtually unlimited capacity, **very high durability** (S3: eleven nines), cheap per GB.
- Accessed over HTTP APIs; higher latency than a database; objects are typically replaced whole rather than edited in place.
- **Storage tiers**: hot (frequent access), infrequent access, archive (cheapest, slow retrieval — for example S3 Glacier).
- Integrates with CDNs for delivery.

**The universal pattern:** store files in object storage and store their **metadata** (owner, size, URL, created date) in a database.

```mermaid
flowchart LR
    C["Client"] -->|"1. request upload URL"| API["API server"]
    API -->|"2. presigned URL"| C
    C -->|"3. upload file directly"| S3[("Object storage")]
    API -->|"save metadata"| DB[("Database")]
    S3 --> CDN["CDN"] -->|"download"| U["Viewers"]
```

**Never store large files in your database** (it bloats backups, hurts performance, and is expensive). The **presigned URL** pattern (Section 15.3) lets clients upload directly to object storage without streaming bytes through your servers.

**Block storage and file storage** — for completeness:
- **Block storage** (AWS EBS): a raw virtual disk attached to one server (databases run on these).
- **File storage** (AWS EFS, NFS — Network File System): a shared file system mounted by many servers.

### 8.12 Vector Databases

Modern AI features represent text, images, or products as **embeddings** — arrays of hundreds or thousands of numbers where similar items are close together in space. A **vector database** stores embeddings and answers **nearest-neighbor queries** ("find the 10 documents most similar to this query") using **ANN (Approximate Nearest Neighbor)** indexes like HNSW (Hierarchical Navigable Small World graphs).

**Use for:** semantic search, recommendations, **RAG (Retrieval-Augmented Generation)** for LLM applications, image similarity, deduplication. Options: **pgvector** (PostgreSQL extension, great default), Pinecone, Milvus, Weaviate, and vector features in Elasticsearch/OpenSearch, Redis, and MongoDB.

### 8.13 How Databases Store Data: B-Trees vs LSM Trees

Understanding storage engines explains *why* some databases are read-optimized and others write-optimized.

#### B-trees (read-optimized, update-in-place)

A **B-tree** (in practice usually a B+ tree) is a balanced tree of fixed-size **pages** (for example 8 KB or 16 KB). Each lookup walks from the root to a leaf in a few steps — a tree with a branching factor of a few hundred and 4 levels can index billions of rows.

```mermaid
flowchart TB
    R["Root: keys 100 and 200"] --> L1["Keys under 100"]
    R --> L2["Keys 100 to 199"]
    R --> L3["Keys 200 and up"]
    L2 --> P1["Leaf: 100, 105, 120 ... pointers to rows"]
    L2 --> P2["Leaf: 150, 163, 199 ... pointers to rows"]
```

- **Reads**: O(log n), few disk pages. Excellent for point lookups and range scans.
- **Writes**: find the page and modify it **in place** (plus a WAL entry for durability). Random writes to disk pages are slower, and page splits add cost.
- Used by: **PostgreSQL, MySQL (InnoDB), Oracle, SQL Server**, most relational indexes.

#### LSM trees (write-optimized, append-only)

An **LSM tree (Log-Structured Merge tree)** turns random writes into **sequential writes**:

```mermaid
flowchart LR
    W["Write"] --> WAL["Append to WAL on disk"]
    W --> MT["Memtable: sorted, in memory"]
    MT -->|"when full, flush"| S1["SSTable level 0: immutable sorted file"]
    S1 -->|"background compaction merges"| S2["SSTable level 1: larger sorted file"]
    S2 --> S3["Level 2 ..."]
```

1. Writes go to an append-only **WAL** (for durability) and an in-memory sorted structure called the **memtable**.
2. When the memtable fills, it's flushed to disk as an immutable, sorted file: an **SSTable (Sorted String Table)**.
3. Background **compaction** merges SSTables, discarding overwritten and deleted values (deletes are recorded as markers called **tombstones**).
4. **Reads** check the memtable, then SSTables from newest to oldest. **Bloom filters** (Section 14.1) per SSTable skip files that definitely don't contain the key.

- **Writes**: very fast (sequential I/O only).
- **Reads**: potentially slower (may check multiple files), mitigated by Bloom filters and caching.
- Compaction consumes background I/O and CPU.
- Used by: **Cassandra, ScyllaDB, HBase, RocksDB, LevelDB, Bigtable**; DynamoDB's internals are similar in spirit.

| | B-tree | LSM tree |
|---|---|---|
| Optimized for | Reads | Writes |
| Write pattern | Random, in place | Sequential, append-only |
| Read cost | Low, predictable | Higher (multiple files), mitigated by Bloom filters |
| Space | Some fragmentation | Temporary duplicates until compaction |
| Typical DBs | PostgreSQL, MySQL | Cassandra, RocksDB, HBase |

### 8.14 Indexes

An **index** is an extra data structure that makes lookups on certain columns fast — like the index at the back of a book, which saves you from reading every page.

Without an index, `SELECT * FROM users WHERE email = 'ada@x.com'` requires a **full table scan**: O(n). With a B-tree index on `email`: O(log n).

#### Types of indexes

- **Primary index** — on the primary key; often determines the physical order of rows (a **clustered index** in MySQL InnoDB).
- **Secondary index** — on other columns (`email`, `created_at`).
- **Composite (multi-column) index** — on several columns, for example `(user_id, created_at)`. Follows the **leftmost prefix rule**: it helps queries filtering on `user_id`, or on `user_id AND created_at`, but not on `created_at` alone. Think of a phone book sorted by (last name, first name): great for finding "Smith, John," useless for finding all "Johns."
- **Covering index** — contains all the columns a query needs, so the database answers from the index alone without touching the table.
- **Unique index** — also enforces uniqueness (no two users with the same email).
- **Hash index** — O(1) exact-match lookups, but no range queries.
- **Full-text (inverted) index** — word-based search (Section 14.6).
- **Geospatial index** — for location queries (R-trees, geohashes; Section 14.4).

#### The cost of indexes

Indexes are not free:

- **Every write must also update every index** → slower inserts and updates.
- Extra storage.
- The query planner may still ignore an index if it's not selective enough.

**Rule of thumb:** index the columns you filter, join, and sort on in frequent queries; avoid indexing everything, especially in write-heavy tables. Composite index order should match your most common query patterns.

### 8.15 How to Choose a Database

This is the practical synthesis of the whole part. Start from **access patterns and requirements**, not from technology fashion.

#### Questions to ask

1. **What does the data look like?** Structured with relationships? Self-contained documents? Simple key → blob? Time series? Files? Graph?
2. **How will it be queried?** By key only? Flexible ad-hoc queries and joins? Full-text search? Range scans by time? Multi-hop relationships? Aggregations over billions of rows?
3. **What consistency is needed?** Must every read see the latest write (money, inventory)? Or is a few seconds of staleness fine (likes, views)?
4. **What's the scale?** Reads/s, writes/s, total data size. Read-heavy or write-heavy?
5. **Do you need transactions** spanning multiple records?
6. **Operational realities:** team expertise, managed service availability, cost.

#### Decision flowchart

```mermaid
flowchart TD
    Start["What is the main need?"] --> F{"Large files: images, video, backups?"}
    F -->|"yes"| OBJ["Object storage like S3, metadata in a DB"]
    F -->|"no"| T{"Need multi-record ACID transactions, joins, or ad-hoc queries?"}
    T -->|"yes"| SC{"Beyond one primary's write capacity?"}
    SC -->|"no"| REL["Relational: PostgreSQL or MySQL"]
    SC -->|"yes"| NEWSQL["Sharded relational, or distributed SQL: Spanner, CockroachDB"]
    T -->|"no"| K{"Access always by a single key?"}
    K -->|"yes"| KV["Key-value: Redis for cache or ephemeral, DynamoDB for durable scale"]
    K -->|"no"| W{"Huge write volume, time-ordered, known query patterns?"}
    W -->|"yes"| WC["Wide-column: Cassandra, ScyllaDB"]
    W -->|"no"| D{"Flexible, nested, self-contained records?"}
    D -->|"yes"| DOC["Document: MongoDB"]
    D -->|"no"| S{"Special access pattern?"}
    S -->|"full-text search"| ES["Search engine: Elasticsearch"]
    S -->|"multi-hop relationships"| G["Graph DB: Neo4j"]
    S -->|"metrics over time"| TS["Time-series DB"]
    S -->|"analytics over billions of rows"| OLAP["Columnar warehouse: BigQuery, Snowflake, ClickHouse"]
    S -->|"similarity search on embeddings"| VEC["Vector DB or pgvector"]
```

#### Quick reference: use case → database

| Use case | Good choice | Why |
|---|---|---|
| User accounts, orders, payments, inventory | Relational (PostgreSQL) | Transactions, constraints, relationships |
| Sessions, tokens, carts (ephemeral) | Redis | Fast key lookups, TTL |
| Durable key lookups at massive scale | DynamoDB | Predictable latency, auto-scaling |
| Caching | Redis / Memcached | In-memory speed |
| Leaderboards, rate limiting, counters | Redis | Sorted sets, atomic increments |
| Product catalog with varied attributes | Document (MongoDB) or relational with JSONB | Flexible schema |
| Chat messages, activity feeds, IoT events | Wide-column (Cassandra) | Write throughput, time-ordered partitions |
| Social graph with multi-hop queries | Graph (Neo4j) | Fast traversals |
| Full-text / fuzzy search | Elasticsearch | Inverted index, relevance |
| Metrics and monitoring | Time-series (Prometheus, InfluxDB) | Ingest rate, downsampling |
| Business analytics, reports | Columnar warehouse | Fast aggregations |
| Images, videos, file uploads | Object storage (S3) + CDN | Cheap, durable, scalable |
| Semantic search, RAG | Vector DB / pgvector | Nearest-neighbor search |
| Distributed configuration, leader election | etcd / ZooKeeper | Strong consistency via consensus |

#### Polyglot persistence

Large systems use **several databases**, each for what it does best — this is called **polyglot persistence**. An e-commerce site might use PostgreSQL (orders), Redis (cache and carts), Elasticsearch (product search), S3 (product images), Cassandra (user activity events), and BigQuery (analytics).

**Interview advice:** justify each database with an access pattern. "I'll use PostgreSQL for orders because we need transactions across order and inventory rows" beats "I'll use MongoDB because it scales." Also: **PostgreSQL is a strong default** — it handles relational data, JSON documents (JSONB), full-text search, geospatial (PostGIS), time series (TimescaleDB), and vectors (pgvector) reasonably well. Introduce specialized databases when scale or access patterns demand it.

**Key takeaways**
- Relational = structured data, joins, ACID transactions; the default. Scaling writes needs sharding or distributed SQL.
- Know isolation levels and anomalies; use pessimistic locks for high contention, optimistic versioning for low contention.
- Key-value = access by key, fastest, simplest. Document = flexible self-contained aggregates. Wide-column = massive writes with known query patterns. Graph = multi-hop relationships.
- Search engines, time-series, columnar warehouses, and vector databases serve specialized access patterns and are usually fed from the primary database.
- Files go to object storage; metadata goes to a database.
- B-trees favor reads (update in place); LSM trees favor writes (append + compaction).
- Indexes speed reads and slow writes; composite indexes follow the leftmost-prefix rule.
- Choose by data shape, query patterns, consistency, scale, and transactions.

---

## Part 9: Scaling Data — Replication, Partitioning, and Consistent Hashing

A single database server eventually hits limits: too many reads, too many writes, too much data, or unacceptable risk if it dies. Two fundamental techniques address this, and they're usually combined:

- **Replication** — keep **copies of the same data** on multiple nodes. Helps **read scaling** and **availability**.
- **Partitioning (sharding)** — **split the data** so each node holds a subset. Helps **write scaling** and **storage capacity**.

```mermaid
flowchart TB
    subgraph REP["Replication: same data, many copies"]
        L["Leader: A to Z"] --> F1["Follower: A to Z"]
        L --> F2["Follower: A to Z"]
    end
    subgraph SH["Sharding: different data per node"]
        S1["Shard 1: A to H"]
        S2["Shard 2: I to P"]
        S3["Shard 3: Q to Z"]
    end
```

### 9.1 Replication

#### Leader-follower (primary-replica, master-slave)

The most common setup.

- One node is the **leader (primary)**: all **writes** go to it.
- The leader streams its changes (its **replication log**, often derived from the WAL) to **followers (replicas)**.
- **Reads** can be served by followers (and the leader).

```mermaid
flowchart LR
    APP["App servers"] -->|"writes"| P[("Primary")]
    P -->|"replication stream"| R1[("Replica 1")]
    P -->|"replication stream"| R2[("Replica 2")]
    APP -->|"reads"| R1
    APP -->|"reads"| R2
```

- **Pros:** simple; scales reads (add replicas); replicas serve as hot backups for failover.
- **Cons:** writes still limited by one leader; replicas may lag behind.

#### Synchronous vs asynchronous replication

| | Synchronous | Asynchronous |
|---|---|---|
| Leader confirms write to client... | after replica(s) confirm | immediately, replicates in background |
| Durability | Data on at least 2 nodes before "success" | Recent writes lost if leader dies before replicating |
| Write latency | Higher | Lower |
| Availability | Write blocks if the synchronous replica is down | Unaffected by replica failures |

Common compromise: **semi-synchronous** — one replica synchronous, the rest asynchronous.

#### Replication lag and its problems

With async replication, followers are slightly behind (usually milliseconds, sometimes seconds or more under load). This causes user-visible anomalies:

1. **Read-your-own-writes violation**: a user updates their profile, refreshes, and sees the old version (the read went to a lagging replica).
   - Fix: read from the leader for data the user just modified (for example, for a few seconds after a write, or always for the user's own profile).
2. **Monotonic reads violation**: a user refreshes twice and sees newer data, then older data (two different replicas with different lag) — time appears to go backwards.
   - Fix: pin each user to one replica (for example, route by hash of user ID).
3. **Consistent prefix violation**: seeing an answer before its question in a chat because they came through different partitions or replicas.

#### Failover

When the leader dies, a follower must be **promoted**:

1. Detect failure (usually via missed heartbeats / timeouts).
2. Choose a new leader (the most up-to-date replica, often via a consensus mechanism, Section 10.5).
3. Reconfigure clients and other replicas to use the new leader.

Risks: with async replication, **unreplicated writes are lost**; and **split-brain** — two nodes both believe they're the leader and accept conflicting writes. Prevented with consensus, quorums, and **fencing** (the old leader is forcibly blocked).

#### Multi-leader replication

Multiple nodes accept writes (typically one leader per data center), replicating to each other.

- **Pros:** local write latency in each region; each region survives independently.
- **Cons:** **write conflicts** — two regions modify the same record at the same time. Must be resolved: **LWW (Last Write Wins)** by timestamp (simple, can silently lose data), merge functions, or **CRDTs (Conflict-free Replicated Data Types)** — data structures designed so concurrent updates always merge deterministically (used in collaborative editors).
- Use for: multi-region active-active setups, offline-first apps (each device is a "leader" that syncs later).

#### Leaderless replication (Dynamo-style)

Any replica accepts reads and writes. The client (or a coordinator node) sends each write to several replicas and reads from several replicas, using **quorums** (Section 10.4) to ensure overlap. Used by **Cassandra, ScyllaDB, Riak**, and Amazon's original Dynamo design.

- **Pros:** no leader failover; very high availability; tolerates slow or dead nodes.
- **Cons:** eventual consistency by default; conflict handling; background repair needed (**read repair** fixes stale replicas when read; **anti-entropy** processes compare replicas using **Merkle trees**, Section 14.8).

| | Leader-follower | Multi-leader | Leaderless |
|---|---|---|---|
| Writes accepted by | One leader | Several leaders | Any replica |
| Conflicts | None (single writer) | Yes | Yes |
| Failover | Needed | Partial | Not needed |
| Typical systems | PostgreSQL, MySQL, MongoDB | Multi-region setups, CouchDB | Cassandra, DynamoDB-style |

### 9.2 Partitioning (Sharding)

**Sharding** splits a large dataset across multiple database nodes (**shards**), each holding a portion. Each shard is typically itself replicated.

#### Vertical vs horizontal partitioning

- **Vertical partitioning** — split by **columns or tables**: put `users` on one database and `orders` on another, or move large rarely-used columns (like `bio`, `avatar_blob`) into a separate table. Microservices naturally do this (each service owns its tables). Sometimes called **functional partitioning** or **federation** when split by feature.
- **Horizontal partitioning (sharding)** — split by **rows**: users 1–1M on shard 1, 1M–2M on shard 2, and so on. Same schema on every shard.

#### The shard key (partition key)

The column used to decide which shard a row belongs to. **Choosing it is the most important sharding decision.** A good shard key:

1. **Distributes data and load evenly** (high cardinality, no dominant values).
2. **Keeps data that's queried together on the same shard** (so most queries hit one shard).
3. **Rarely or never changes** (moving a row between shards is painful).

Examples:
- Chat app: shard by `chat_id` → all messages of a chat on one shard; "load chat history" hits one shard.
- E-commerce orders: shard by `user_id` → "my orders" hits one shard; but "all orders of product X" hits all shards.
- Multi-tenant SaaS (Software as a Service): shard by `tenant_id`.

#### Sharding strategies

**1. Range-based sharding** — each shard owns a continuous range of keys.

```
Shard 1: user_id 1 – 1,000,000
Shard 2: user_id 1,000,001 – 2,000,000
Shard 3: user_id 2,000,001 – 3,000,000
```

- **Pros:** efficient range queries ("orders from last week" when sharding by date); simple.
- **Cons:** **hotspots** — with time-based or sequential keys, all new writes hit the latest shard.

**2. Hash-based sharding** — `shard = hash(key) mod N`.

- **Pros:** even distribution; no hotspots from sequential keys.
- **Cons:** range queries must hit all shards; **adding a shard reshuffles almost everything** with naive `mod N` (fixed by consistent hashing, Section 9.4).

**3. Directory-based (lookup) sharding** — a lookup service maps each key (or key range) to a shard.

- **Pros:** maximum flexibility; move individual tenants between shards.
- **Cons:** the directory is an extra hop and must be highly available (and cached).

**4. Geographic sharding** — shard by region (EU users on EU shards). Helps latency and **data residency laws** such as the **GDPR (General Data Protection Regulation)**.

#### Problems sharding introduces

| Problem | Explanation | Mitigations |
|---|---|---|
| **Cross-shard queries** | Queries not filtered by shard key must hit all shards (**scatter-gather**) | Choose shard key by main access pattern; secondary indexes; denormalize; separate search/analytics stores |
| **Cross-shard joins** | Joining data on different shards isn't possible in one query | Denormalize; join in application code; co-locate related data |
| **Cross-shard transactions** | ACID across shards requires distributed transactions | Design to keep transactions within one shard; sagas (Section 10.7) |
| **Hotspots (hot partitions)** | One key gets disproportionate traffic (celebrity user, viral post) | Split hot keys (add a random suffix), dedicated shards, caching |
| **Resharding** | Growing from N to M shards requires moving data live | Consistent hashing, many small **logical shards** mapped onto fewer physical nodes |
| **Operational complexity** | Backups, schema migrations, monitoring across many shards | Managed or natively distributed databases |

**Advice:** don't shard until you have to. Try vertical scaling, read replicas, caching, and query optimization first. When you do shard, the most common interview answer is "hash-based sharding on `<key>` with consistent hashing," justified by the access pattern.

### 9.3 Other Data-Scaling Techniques

- **Read replicas** — the cheapest way to scale reads.
- **Caching** — Part 7.
- **Connection pooling** — database connections are expensive (PostgreSQL uses a process per connection). A pooler like **PgBouncer** lets thousands of app instances share a few hundred real connections. Especially important with serverless functions.
- **Denormalization and materialized views** — precompute expensive query results. A **materialized view** is a stored query result that's refreshed periodically or on change.
- **Archiving / tiering** — move old, rarely-accessed data to cheaper storage.
- **CQRS** — separate read and write models (Section 11.8).

### 9.4 Consistent Hashing

Consistent hashing solves the "`mod N` reshuffle" problem and appears everywhere: sharded databases (Cassandra, DynamoDB), distributed caches, load balancers, CDNs.

#### The problem with `hash(key) mod N`

With 4 servers, `key → hash(key) mod 4`. Add a 5th server: now `hash(key) mod 5`. For most keys the result changes — roughly **80% of keys move** to a different server. For a cache, that means a massive miss storm; for a database, moving most of the data.

#### The idea: a hash ring

1. Imagine the hash output space (for example 0 to 2^32 − 1) bent into a **ring**.
2. Hash each **server** to a position on the ring.
3. Hash each **key** to a position on the ring.
4. A key belongs to the **first server found walking clockwise** from the key's position.

To draw it simply, "unroll" the ring into a line where positions go from 0 to 99 and then **wrap back to 0**. Clockwise = moving right, wrapping around at the end.

```
position:  0      10      25      40      60      75      90     99 -> wraps to 0
           |------S_A-----K1------S_B-----K2------S_C-----K3------|
```

- K1 at 25 → next server to the right is **S_B** (40).
- K2 at 60 → **S_C** (75).
- K3 at 90 → nothing to the right, so wrap around → **S_A** (10).

So S_A owns the arc (75, 10], S_B owns (10, 40], and S_C owns (40, 75].

#### Adding or removing a server

- **Add server S_E at position 30**: only keys in the arc (10, 30] move, from S_B to S_E. K1 (at 25) moves to S_E; K2 and K3 don't move at all.
- **Remove S_B**: only S_B's keys move, to the next server clockwise (S_C). Keys owned by S_A and S_C stay put.

On average only **about 1/N of keys move** when one server is added or removed — instead of nearly all of them.

#### Virtual nodes

With only a few servers, their random positions can be uneven — one server may own a huge arc of the ring. Fix: give each physical server many positions on the ring (for example 100–200 **virtual nodes**, "vnodes").

- Spreads load evenly.
- When a server leaves, its load is spread across **many** others instead of dumping all of it on one neighbor.
- Allows **weighting**: a bigger server gets more virtual nodes.

**Replication on the ring:** store each key on the next R distinct servers clockwise (Cassandra and Dynamo work this way).

**Key takeaways**
- Replication = copies (read scaling, availability); sharding = splitting (write scaling, capacity). Combine both.
- Leader-follower is the default; async replication causes lag (fix read-your-writes by reading from the leader). Multi-leader and leaderless add availability but create conflicts.
- The shard key is the critical choice: even distribution, queries hit one shard, immutable.
- Range sharding = good range queries, hotspot risk; hash sharding = even spread, scatter-gather for ranges; directory = flexible.
- Consistent hashing moves only ~1/N of keys on membership changes; virtual nodes balance load.

---

## Part 10: Distributed Systems Theory

Once data and computation live on many machines connected by a network, new problems appear that don't exist on a single machine. This part gives you the concepts and vocabulary behind them.

### 10.1 Why Distributed Systems Are Hard

The **Fallacies of Distributed Computing** (from engineers at Sun Microsystems) are false assumptions people make:

1. The network is reliable.
2. Latency is zero.
3. Bandwidth is infinite.
4. The network is secure.
5. Topology doesn't change.
6. There is one administrator.
7. Transport cost is zero.
8. The network is homogeneous.

The core difficulty is **partial failure**: on one machine, things usually either work or crash completely. In a distributed system, some parts work while others fail, and **you often can't tell the difference between a slow node and a dead one**. If you send a request and get no response, maybe:

- the request was lost,
- the remote node crashed before processing it,
- it processed it and crashed before responding,
- the response was lost,
- or it's just slow and will respond later.

This is why timeouts, retries, idempotency, and consensus exist.

### 10.2 The CAP Theorem

The **CAP theorem** (Eric Brewer) says a distributed data store can't simultaneously guarantee all three of:

- **C — Consistency**: every read receives the most recent write (or an error). All nodes see the same data at the same time. (Technically **linearizability** — Section 10.3.)
- **A — Availability**: every request to a non-failed node receives a (non-error) response — without guarantee that it's the latest data.
- **P — Partition tolerance**: the system keeps working even when the network drops or delays messages between nodes (a **network partition**).

**The correct way to understand CAP:** network partitions *will* happen in any real distributed system, so **P is not optional**. The real choice is: **when a partition happens, do you choose Consistency or Availability?**

```mermaid
flowchart LR
    subgraph DC1["Node A: US"]
        A["x = 1 updated to x = 2"]
    end
    subgraph DC2["Node B: EU"]
        B["x = 1, did not receive update"]
    end
    A -.-|"network partition: no messages get through"| B
    U["User reads x from Node B"] --> B
```

A user asks Node B for `x` during the partition. Node B can:

- **Refuse / return an error** until it can confirm the latest value → **CP** (consistent, not available).
- **Return `x = 1`** (possibly stale) → **AP** (available, not consistent).

| Choice | Behavior during partition | Examples | Good for |
|---|---|---|---|
| **CP** | Some requests fail or wait; data never contradictory | ZooKeeper, etcd, HBase, Google Spanner, MongoDB with majority writes/reads, traditional RDBMS with synchronous failover | Banking balances, inventory counts, bookings, leader election, configuration |
| **AP** | Always responds; may return stale data; reconciles later | Cassandra, DynamoDB (default settings), Riak, CouchDB, DNS | Social feeds, likes, view counts, shopping carts, product catalog |

"**CA**" systems (consistent and available, not partition tolerant) only really exist on a single node — once there's a network, partitions are possible.

**How to use CAP in an interview:** decide per feature. "For the ticket booking itself, I prefer consistency — double-selling a seat is unacceptable, so I'd rather return an error. For the event browsing page, availability matters more; slightly stale seat maps are fine." Different parts of one system can make different choices.

#### PACELC: the more complete picture

CAP only talks about behavior *during partitions*. **PACELC** extends it:

> If there's a **P**artition, choose **A**vailability or **C**onsistency; **E**lse (normal operation), choose **L**atency or **C**onsistency.

Even without failures, strong consistency costs latency (you must coordinate with other replicas, maybe across regions). Examples: Cassandra and DynamoDB are **PA/EL** (favor availability and low latency); Spanner is **PC/EC** (favors consistency, pays in latency).

### 10.3 Consistency Models

"Consistency" has several strengths. From strongest to weakest:

| Model | Guarantee | Intuition |
|---|---|---|
| **Strong consistency (linearizability)** | Once a write completes, every subsequent read (anywhere) returns it. The system behaves like a single copy. | One shared whiteboard everyone looks at |
| **Sequential consistency** | All nodes see operations in the same order, but not necessarily in real-time order | Everyone sees the same movie, maybe with a delay |
| **Causal consistency** | Operations that are causally related (a reply to a comment) are seen in the right order by everyone; unrelated ones may appear in different orders | You never see an answer before its question |
| **Read-your-writes** | A user always sees their own writes | After posting, you see your post |
| **Monotonic reads** | Once you've seen a value, you never see an older one | Time doesn't go backwards for you |
| **Eventual consistency** | If writes stop, all replicas eventually converge to the same value; meanwhile reads may be stale | Gossip spreading through a town |

**Strong consistency** is easiest to program against but expensive (coordination, latency, reduced availability). **Eventual consistency** is cheap and highly available but pushes complexity into the application.

Many systems offer strong consistency for some operations and eventual for others (DynamoDB has "strongly consistent reads" as an option at higher cost).

**BASE** is sometimes contrasted with ACID for NoSQL systems: **B**asically **A**vailable, **S**oft state, **E**ventual consistency.

### 10.4 Quorums: Tunable Consistency

In replicated systems (especially leaderless ones), **quorums** let you tune consistency vs availability:

- **N** = number of replicas for each piece of data.
- **W** = number of replicas that must acknowledge a **write** for it to succeed.
- **R** = number of replicas that must respond to a **read**.

**The rule:** if **R + W > N**, every read set overlaps with every write set in at least one node, so a read will see the latest write (given version comparison).

```
N = 3 replicas: [Node1] [Node2] [Node3]

Write with W = 2:  Node1 ✓  Node2 ✓  Node3 (not yet)
Read  with R = 2:  Node2 ✓  Node3 ✓
Overlap at Node2 → the read sees the latest version (newest timestamp wins)
```

| Setting (N = 3) | Behavior |
|---|---|
| W = 3, R = 1 | Fast reads; writes fail if any node is down |
| W = 1, R = 3 | Fast writes; reads fail if any node is down |
| **W = 2, R = 2** | **Balanced "quorum"**; tolerates one node down for both reads and writes |
| W = 1, R = 1 | Fastest, most available; eventual consistency (R + W = 2, not > 3) |

A **majority quorum** is `⌊N/2⌋ + 1` (2 of 3, 3 of 5). Majorities always overlap, which is also the foundation of consensus algorithms. Cassandra exposes this directly with consistency levels like `ONE`, `QUORUM`, and `ALL`.

### 10.5 Consensus and Leader Election

**Consensus** is getting multiple nodes to **agree on a value** (or a sequence of values) despite some nodes failing or messages being delayed. It's needed for:

- **Leader election** — agreeing which node is the leader, so there's exactly one.
- **Replicated logs** — agreeing on the order of operations, so all replicas apply the same changes in the same order.
- **Distributed locks and configuration** — agreeing who holds a lock, what the current config is.

#### Raft (the understandable one)

**Raft** is the most widely taught and used consensus algorithm (etcd, Consul, CockroachDB, TiDB, Kafka's KRaft mode). Simplified:

1. Nodes are **followers**, **candidates**, or the **leader**.
2. The leader sends regular **heartbeats**. If a follower hears nothing for a random timeout, it becomes a **candidate** and requests votes, starting a new **term** (an election number).
3. A candidate receiving votes from a **majority** becomes leader for that term. (Random timeouts make split votes rare.)
4. Clients send writes to the leader, which appends them to its **log** and replicates to followers. An entry is **committed** once a **majority** has stored it.
5. If the leader fails, a new election happens; only candidates with up-to-date logs can win, so committed entries are never lost.

```mermaid
stateDiagram-v2
    [*] --> Follower
    Follower --> Candidate: election timeout, no heartbeat
    Candidate --> Leader: wins majority of votes
    Candidate --> Follower: another leader discovered
    Candidate --> Candidate: split vote, new election
    Leader --> Follower: discovers higher term
```

**Why majorities?** With 5 nodes, a majority is 3. Any two majorities overlap in at least one node, so two leaders can't both be elected in the same term, and a committed entry is always known to any future majority. A cluster of **2F + 1 nodes tolerates F failures** — so clusters are usually 3 nodes (tolerates 1 failure) or 5 nodes (tolerates 2).

**Paxos** is the older, famously hard-to-understand algorithm with the same goal (used in Google's Chubby and Spanner). **ZooKeeper** uses a similar protocol called **ZAB (ZooKeeper Atomic Broadcast)**.

**In interviews:** you almost never implement consensus. You say "use etcd / ZooKeeper / a Raft-based system for leader election and coordination," or "this database uses Raft internally, so writes are strongly consistent."

#### Distributed locks

A **distributed lock** ensures only one process across many machines does something at a time (for example, only one worker processes a given job). Implementations: ZooKeeper/etcd (strongly consistent, safest), Redis (`SET key token NX PX 30000` — simple and fast, but weaker guarantees during failures), or database row locks.

**Danger:** a process holding a lock may pause (a long garbage collection pause, network delay), its lock expires, another process takes it, and then the first one wakes up and continues as if it still holds it. Solution: **fencing tokens** — every lock acquisition gets an increasing number, and the storage layer rejects writes with an older token than it has already seen.

### 10.6 Time and Ordering

On one machine, "which event happened first?" is easy. Across machines, it's surprisingly hard.

- **Physical clocks drift.** Each machine's clock is synchronized via **NTP (Network Time Protocol)**, but clocks can still differ by milliseconds or more — this difference is called **clock skew**.
- Consequence: using timestamps from different machines to order events (for example **Last Write Wins**) can silently discard the actually-newer write.

Solutions:

- **Lamport timestamps (logical clocks)** — each node keeps a counter, increments it on each event, and on receiving a message sets its counter to `max(local, received) + 1`. Gives an ordering consistent with causality (if A caused B, A's timestamp < B's), but can't tell if two events were concurrent.
- **Vector clocks** — each node tracks a counter *per node*. Can detect whether two events are causally ordered or **concurrent** (a true conflict needing resolution). Used in Dynamo-style systems.
- **Hybrid Logical Clocks (HLC)** — combine physical time with a logical counter (used by CockroachDB).
- **TrueTime** (Google Spanner) — GPS and atomic clocks give a bounded uncertainty interval; Spanner waits out the uncertainty to guarantee global ordering.

**Practical takeaway:** don't rely on wall-clock timestamps from different machines for correctness-critical ordering. Use a single sequencer (a database sequence, a Kafka partition's offsets), logical clocks, or version numbers.

### 10.7 Distributed Transactions: 2PC and Sagas

When an operation must update data in **multiple services or databases** atomically (for example, "create order" + "charge payment" + "reserve inventory"), a single-database ACID transaction isn't available.

#### Two-Phase Commit (2PC)

A **coordinator** asks all participants to prepare, then tells them all to commit (or abort).

```mermaid
sequenceDiagram
    participant C as Coordinator
    participant A as Order DB
    participant B as Inventory DB
    Note over C,B: Phase 1 - Prepare
    C->>A: Prepare
    C->>B: Prepare
    A-->>C: Yes, ready - locks held
    B-->>C: Yes, ready - locks held
    Note over C,B: Phase 2 - Commit
    C->>A: Commit
    C->>B: Commit
    A-->>C: Done
    B-->>C: Done
```

- If any participant votes "no," the coordinator tells everyone to abort.
- **Pros:** true atomicity across databases.
- **Cons:** **blocking** — if the coordinator crashes after participants prepared, they hold locks and wait (possibly a long time); slow (multiple round trips, locks held throughout); the coordinator is a critical component; poor fit across microservices owned by different teams.
- Used inside some distributed databases (Spanner combines 2PC with consensus to avoid the blocking problem) and in XA transactions, but **rarely across microservices**.

#### The Saga pattern

A **saga** breaks a distributed transaction into a **sequence of local transactions**, each in one service. If a step fails, previously completed steps are undone by **compensating transactions** (semantic undo operations).

```mermaid
flowchart LR
    S1["1. Create order: PENDING"] --> S2["2. Reserve inventory"]
    S2 --> S3["3. Charge payment"]
    S3 --> S4["4. Mark order CONFIRMED"]
    S3 -.->|"payment fails"| C2["Compensate: release inventory"]
    C2 -.-> C1["Compensate: mark order CANCELLED"]
```

Two coordination styles:

| | Choreography | Orchestration |
|---|---|---|
| How | Each service reacts to events and emits its own ("OrderCreated" → inventory service reserves → emits "InventoryReserved" → ...) | A central **orchestrator** tells each service what to do next and tracks state |
| Pros | Loose coupling, no central component | Clear flow in one place, easier to debug and change |
| Cons | Flow is implicit and spread out; hard to follow as it grows | Orchestrator is extra infrastructure (for example Temporal, AWS Step Functions) |

**Saga trade-offs:** no isolation — other transactions can see intermediate states (an order "PENDING" before payment); compensations must be carefully designed (you can't "un-send" an email, but you can send an apology email); every step must be **idempotent** because of retries.

**Interview default:** for multi-service workflows, propose a saga (usually orchestrated for complex flows) with idempotent steps and compensating actions, not 2PC.

### 10.8 Delivery Guarantees and Idempotency

When messages or requests travel over unreliable networks with retries, there are three possible guarantees:

| Guarantee | Meaning | How | Risk |
|---|---|---|---|
| **At-most-once** | Delivered 0 or 1 times | Send once, never retry | Messages lost |
| **At-least-once** | Delivered 1 or more times | Retry until acknowledged | **Duplicates** |
| **Exactly-once** | Delivered exactly 1 time | Very hard end-to-end | — |

True exactly-once delivery across arbitrary systems is essentially impossible because of the "did my request succeed?" ambiguity (Section 10.1). What systems actually provide is **effectively-once processing** = **at-least-once delivery + idempotent processing** (or transactional deduplication within one system, as Kafka offers).

**Idempotency** means processing the same message twice has the same effect as processing it once. Techniques:

- **Idempotency keys / message IDs**: store processed IDs; skip if already seen (with a unique constraint in the database).
- **Naturally idempotent operations**: "set status = PAID" is idempotent; "add $10" is not. Prefer absolute writes over relative ones where possible.
- **Conditional writes**: "update only if version = 7."
- **Upserts** ("insert or update") keyed by a deterministic ID.

**This is one of the most important principles in distributed systems: assume every message may arrive more than once, and make handlers idempotent.**

### 10.9 Generating Unique IDs at Scale

A single database's auto-increment ID becomes a bottleneck (and a single point of failure) across shards. Options:

| Approach | Description | Pros | Cons |
|---|---|---|---|
| **Auto-increment** | Database sequence | Simple, small, ordered | Single point of contention; leaks business volume; not shard-friendly |
| **UUID v4** | 128-bit random | Generated anywhere, no coordination | 16 bytes; **random order hurts B-tree index locality** (inserts scatter across pages); not sortable |
| **UUID v7** | 128-bit with a millisecond timestamp prefix + randomness | Generated anywhere, **time-sortable**, index-friendly | 16 bytes |
| **Snowflake ID** | 64-bit: timestamp + machine ID + sequence | Compact, time-sortable, generated locally at high rates | Requires assigning unique machine IDs; depends on clocks |
| **Ticket server / range allocation** | Central service hands out blocks of IDs (for example 1,000 at a time) | Compact, simple | The allocator must be highly available |

**Snowflake layout** (from Twitter):

```
| 1 bit  |          41 bits           |   10 bits    |   12 bits    |
| unused | timestamp in ms since epoch  |  machine ID  |  sequence    |
```

- 41 bits of milliseconds ≈ 69 years of IDs from a custom start date (epoch).
- 10 bits → 1,024 machines.
- 12 bits → 4,096 IDs per millisecond per machine (~4 million per second per machine).
- IDs are roughly sorted by time — handy for "newest first" queries and pagination cursors.

### 10.10 Failure Detection, Heartbeats, and Gossip

- **Heartbeats**: nodes periodically send "I'm alive" messages. Missing several heartbeats → suspected dead. The timeout is a trade-off: too short → false alarms (and unnecessary failovers); too long → slow detection.
- **Gossip protocol**: each node periodically exchanges state with a few random other nodes; information spreads through the cluster like a rumor, reaching everyone in O(log N) rounds. Used for cluster membership and failure detection in Cassandra, Consul, and others. Scales well because there's no central coordinator.

**Key takeaways**
- In distributed systems, you can't distinguish slow from dead; partial failure is the norm.
- CAP: partitions happen, so choose consistency (CP) or availability (AP) during them — per feature. PACELC adds the latency-vs-consistency trade-off in normal operation.
- Consistency spectrum: linearizable → causal → read-your-writes → eventual.
- Quorums: R + W > N gives overlapping reads and writes. Majorities are the basis of consensus.
- Raft/Paxos provide consensus for leader election and replicated logs; use systems like etcd/ZooKeeper rather than building your own. Use fencing tokens with distributed locks.
- Wall clocks drift; use logical clocks, sequencers, or versions for ordering.
- Avoid 2PC across services; use sagas with compensating transactions.
- Exactly-once = at-least-once + idempotency. Make every handler idempotent.
- IDs: UUID v7 or Snowflake for sortable, coordination-free IDs.

---

## Part 11: Asynchronous Processing — Queues, Pub/Sub, and Streams

### 11.1 Synchronous vs Asynchronous Communication

- **Synchronous**: the caller sends a request and **waits** for the response (HTTP, gRPC). Simple to reason about, but the caller is blocked, and if the callee is slow or down, the caller suffers too. Chains of synchronous calls multiply latency and reduce availability (Section 4.3).
- **Asynchronous**: the caller hands off a message to an intermediary (a **message broker**) and **moves on**. Someone processes it later.

Real-life analogy: a phone call (synchronous — both must be available at the same time) vs sending an email (asynchronous — the recipient reads it when ready).

**Example — uploading a video:**

```mermaid
flowchart LR
    U["User uploads video"] --> API["Upload API"]
    API -->|"store raw file"| S3[("Object storage")]
    API -->|"publish VideoUploaded"| Q["Message queue"]
    API -->|"202 Accepted, processing"| U
    Q --> W1["Transcoding worker"]
    Q --> W2["Transcoding worker"]
    Q --> W3["Transcoding worker"]
    W1 --> S3
```

The user gets a response in milliseconds; transcoding (minutes of work) happens in the background.

**Why go asynchronous?**

| Benefit | Explanation |
|---|---|
| **Decoupling** | Producer doesn't need to know who consumes, or whether they're up right now |
| **Absorbing spikes (load leveling)** | The queue buffers bursts; workers process at a steady rate. Black Friday orders pile up in the queue instead of crashing the database |
| **Reliability** | If a consumer crashes, messages wait in the queue and are retried |
| **Independent scaling** | Add more workers when the queue grows |
| **Responsiveness** | User-facing requests return fast; slow work happens in the background |
| **Fan-out** | One event can trigger many independent reactions (email, analytics, search indexing) |

**Costs:** eventual consistency (the result isn't ready immediately), harder debugging (the flow is spread across services and time), duplicates and ordering issues, and one more piece of infrastructure to run.

**Vocabulary:** a **producer** (publisher) sends messages; a **consumer** (subscriber, worker) receives them; the **broker** stores and routes them.

### 11.2 Message Queues (Point-to-Point)

A **message queue** delivers each message to **exactly one** consumer among possibly many. Multiple consumers on the same queue are called **competing consumers** — they share the work.

```mermaid
flowchart LR
    P1["Producer"] --> Q["Queue: m1, m2, m3, m4"]
    P2["Producer"] --> Q
    Q -->|"m1, m3"| C1["Worker 1"]
    Q -->|"m2, m4"| C2["Worker 2"]
```

How a message's life typically goes (for example in **Amazon SQS — Simple Queue Service**):

1. Producer sends the message; the broker stores it durably.
2. A consumer receives it; the message becomes **invisible** to other consumers for a **visibility timeout** (say 30 s).
3. The consumer processes it and **acknowledges (acks)** / deletes it.
4. If the consumer crashes and never acks, the visibility timeout expires and the message becomes visible again → another worker retries it. (This is why delivery is **at-least-once** and handlers must be idempotent.)

**Use for:** background jobs, task distribution (send email, resize image, generate PDF), smoothing load on a downstream system.

**Examples:** Amazon SQS, RabbitMQ, ActiveMQ, Azure Service Bus queues, Redis-based job queues (BullMQ — popular in Node.js/TypeScript).

### 11.3 Publish/Subscribe (Pub/Sub)

In **pub/sub**, a publisher sends a message to a **topic**, and **every subscriber** of that topic gets its own copy. The publisher doesn't know who (or how many) the subscribers are.

```mermaid
flowchart LR
    P["Order Service"] -->|"OrderPlaced"| T["Topic: orders"]
    T --> E["Email Service"]
    T --> I["Inventory Service"]
    T --> A["Analytics Service"]
    T --> S["Search Indexer"]
```

**Use for:** broadcasting events to many independent consumers — notifications, cache invalidation, keeping multiple services in sync. Adding a new consumer requires **no change** to the producer.

**Examples:** Amazon SNS (Simple Notification Service), Google Cloud Pub/Sub, Redis Pub/Sub (fire-and-forget, no persistence), Kafka topics with multiple consumer groups.

A very common combination is **fan-out to queues**: an SNS topic delivers to several SQS queues, one per consuming service, so each service gets its own durable buffer.

### 11.4 Event Streams and Logs (Kafka)

**Apache Kafka** (and similar: Amazon Kinesis, Redpanda, Apache Pulsar) is a **distributed, append-only log**. It deserves its own section because it's used differently from traditional queues and appears constantly in interviews.

#### Core concepts

- **Topic** — a named stream of events (for example `page-views`).
- **Partition** — each topic is split into partitions, each an ordered, append-only log stored on disk and replicated across brokers. Partitions are the unit of parallelism.
- **Offset** — a message's position (sequence number) within a partition.
- **Partition key** — messages with the same key (for example `user_id`) go to the same partition, so **ordering is guaranteed per key**.
- **Consumer group** — a set of consumers sharing the work of a topic. Each partition is read by **exactly one consumer in the group**. Different groups read independently (that's how Kafka does pub/sub).
- **Retention** — messages are **not deleted when consumed**; they're kept for a configured time (for example 7 days) or size. Consumers track their own offsets.

```mermaid
flowchart LR
    subgraph T["Topic: orders, 3 partitions"]
        P0["Partition 0: offsets 0..1500"]
        P1["Partition 1: offsets 0..1320"]
        P2["Partition 2: offsets 0..1710"]
    end
    subgraph G1["Consumer group: billing"]
        C1["Consumer A"]
        C2["Consumer B"]
    end
    subgraph G2["Consumer group: analytics"]
        C3["Consumer C"]
    end
    P0 --> C1
    P1 --> C1
    P2 --> C2
    P0 --> C3
    P1 --> C3
    P2 --> C3
```

#### What makes a log different from a queue

| | Traditional queue (SQS, RabbitMQ) | Log (Kafka, Kinesis) |
|---|---|---|
| After consumption | Message deleted | Message retained until retention expires |
| Replay | Not possible | **Rewind offsets and reprocess history** |
| Multiple readers | Needs pub/sub fan-out | Built in: each consumer group reads independently |
| Ordering | Usually best-effort (FIFO queues exist) | Strict order **within a partition** |
| Parallelism | Add consumers freely | Limited by **number of partitions** (consumers in a group ≤ partitions) |
| Throughput | High | Very high (sequential disk I/O, batching) — millions of messages/s per cluster |
| Per-message features | Delays, visibility timeouts, per-message acks, priorities | Offset-based; no per-message ack or delay |
| Best for | Task/job distribution | Event streaming, event sourcing, analytics pipelines, CDC, activity tracking |

**Interview heuristic:**
- "Run this job in the background" → **queue** (SQS, RabbitMQ).
- "Many systems react to this event" → **pub/sub** (SNS, or Kafka).
- "High-volume event stream, need ordering per key, replay, or multiple independent consumers" → **Kafka**.

**Choosing the partition key:** it decides ordering and load balance. Key by `user_id` to keep each user's events in order. Watch for **hot partitions** (one very active key); too few partitions limits consumer parallelism.

### 11.5 Operational Concerns with Messaging

#### Delivery semantics

Covered in Section 10.8: most brokers give **at-least-once** delivery. Make consumers **idempotent** (dedupe by message ID). Kafka offers exactly-once semantics *within Kafka* (transactions + idempotent producers), but side effects outside Kafka (sending an email, charging a card) still need idempotency.

#### Ordering

- Global ordering across a whole distributed system is expensive and rarely needed.
- Usually you need **ordering per entity** (per user, per order, per chat) → use a partition key (Kafka) or message group ID (SQS FIFO).
- Retries can reorder messages; include sequence numbers or versions if order matters, and ignore stale updates.

#### Retries, poison messages, and DLQs

- A **poison message** always fails (malformed data, a bug) and would be retried forever, blocking progress.
- Solution: retry a limited number of times (with backoff, Section 13.4), then move it to a **DLQ (Dead Letter Queue)** — a side queue for failed messages that engineers inspect, fix, and replay.

```mermaid
flowchart LR
    Q["Main queue"] --> C["Consumer"]
    C -->|"success: ack"| Done["Done"]
    C -->|"failure, retry up to N times"| Q
    Q -->|"after N failures"| DLQ["Dead Letter Queue"]
    DLQ --> OPS["Alert, inspect, fix, replay"]
```

#### Backpressure and consumer lag

- **Consumer lag** = how far behind consumers are (queue depth, or latest offset minus consumer's offset). A key metric to monitor and autoscale on.
- **Backpressure** = signaling producers to slow down when consumers can't keep up (or bounding queue size and rejecting new work). Without it, queues grow unbounded, latency explodes, and memory runs out.

### 11.6 Event-Driven Architecture

In an **event-driven architecture (EDA)**, services communicate by producing and reacting to **events** — facts about something that happened (`OrderPlaced`, `PaymentFailed`, `UserSignedUp`).

**Events vs commands:**

| | Event | Command |
|---|---|---|
| Meaning | "This happened" (past tense) | "Please do this" (imperative) |
| Example | `OrderPlaced` | `SendInvoice` |
| Receivers | Zero or many; producer doesn't care | One specific handler |
| Coupling | Loose | Tighter |

**Event design tip:** events can carry just an ID ("event notification": consumers call back for details) or the full relevant data ("event-carried state transfer": consumers don't need to call back, reducing coupling and load). The second is more common in large systems.

### 11.7 The Dual-Write Problem, the Outbox Pattern, and CDC

A classic bug: a service writes to its database **and** publishes an event.

```typescript
await db.orders.insert(order);          // 1. succeeds
await kafka.publish('OrderPlaced', order); // 2. crashes or fails here
```

If step 2 fails, the database has the order but nobody else ever hears about it. If you publish first and the DB write fails, others react to an order that doesn't exist. You can't make a database and a broker atomic together — this is the **dual-write problem**.

#### The transactional outbox pattern

1. In the **same database transaction**, write the business data **and** a row into an `outbox` table.
2. A separate **relay** process reads the outbox and publishes events to the broker, marking rows as sent.

```mermaid
flowchart LR
    S["Order Service"] -->|"one transaction: insert order and outbox row"| DB[("Orders DB with outbox table")]
    R["Outbox relay or CDC"] -->|"reads new outbox rows"| DB
    R -->|"publish"| K["Kafka"]
    K --> C1["Consumers"]
```

Because both writes happen in one ACID transaction, the event is published **if and only if** the order was saved (at least once — consumers dedupe).

#### CDC: Change Data Capture

**CDC** means streaming every change (insert, update, delete) from a database's internal replication log (PostgreSQL WAL, MySQL binlog) as events. Tools: **Debezium**, AWS DMS, DynamoDB Streams.

Uses:
- Implement the outbox relay without polling.
- Keep search indexes (Elasticsearch), caches, and data warehouses in sync with the primary database.
- Migrate data between systems with zero downtime.

### 11.8 CQRS and Event Sourcing

#### CQRS: Command Query Responsibility Segregation

**CQRS** separates the **write model** (commands that change state) from the **read model** (queries), often using different data stores optimized for each.

```mermaid
flowchart LR
    C["Client"] -->|"commands: create, update"| W["Write service"]
    W --> WDB[("Write DB: normalized, PostgreSQL")]
    WDB -->|"events or CDC"| P["Projector"]
    P --> RDB[("Read DB: denormalized views, Elasticsearch or Redis")]
    C -->|"queries"| R["Read service"]
    R --> RDB
```

- **Pros:** each side scales and is optimized independently; read models can be shaped exactly for each screen; great for read-heavy systems with complex queries.
- **Cons:** eventual consistency between write and read sides; more moving parts. Don't use it for simple CRUD apps.

#### Event sourcing

Instead of storing the **current state**, store the **sequence of events** that led to it. Current state is derived by replaying events.

```
Account 42 event log:
1. AccountOpened      { owner: "Ada" }
2. MoneyDeposited     { amount: 100 }
3. MoneyWithdrawn     { amount: 30 }
4. MoneyDeposited     { amount: 50 }
→ Current balance = 100 − 30 + 50 = 120
```

- **Pros:** complete **audit trail** (you know exactly how you got here — essential in finance), time travel (state at any past moment), rebuild new read models by replaying history, natural fit with CQRS and Kafka.
- **Cons:** complexity; replaying long histories is slow (mitigated by periodic **snapshots**); evolving event schemas is tricky; querying current state requires projections.
- **Use for:** banking ledgers, accounting, order lifecycles, collaborative editing history, systems where auditability is a requirement.

### 11.9 Batch vs Stream Processing

Large volumes of data are processed in two styles:

| | Batch processing | Stream processing |
|---|---|---|
| Input | A bounded dataset (yesterday's logs) | An unbounded, continuous flow of events |
| Latency | Minutes to hours | Milliseconds to seconds |
| Examples | Nightly reports, ML training data, billing runs | Fraud detection, live dashboards, trending topics, real-time recommendations |
| Tools | **MapReduce** (Hadoop), **Apache Spark**, SQL on a data warehouse | **Apache Flink**, **Kafka Streams**, Spark Structured Streaming |

**MapReduce** in one sentence: split the data across many machines, **map** each record to key-value pairs, **shuffle** so all values for a key land on one machine, then **reduce** them (for example, count words across a billion documents).

**Windowing** in stream processing: aggregate over time windows, for example "clicks per ad in each 1-minute window" (**tumbling** windows: fixed, non-overlapping; **sliding/hopping** windows: overlapping; **session** windows: grouped by activity gaps).

**Architectures:** the **Lambda architecture** runs batch and streaming pipelines side by side (accurate batch + fast approximate streaming). The **Kappa architecture** uses only streaming, reprocessing by replaying the log. Many modern systems favor Kappa-style designs with Kafka + Flink.

### 11.10 Background Jobs, Scheduling, and Workflows

- **Job queues** — BullMQ (Node.js), Sidekiq (Ruby), Celery (Python), or SQS + workers.
- **Scheduled / cron jobs** — periodic tasks (cleanup, reports). At scale, use a distributed scheduler so a job runs exactly once even with many instances (leader election or a lock, Section 10.5).
- **Delayed jobs** — "send a reminder in 24 hours" (delay queues, or a table of due jobs polled by time).
- **Workflow engines** — for long-running, multi-step processes with retries, timeouts, and compensations (sagas): **Temporal**, AWS Step Functions, Apache Airflow (for data pipelines). They persist workflow state so a process can survive crashes and continue.

**Key takeaways**
- Async messaging decouples services, absorbs spikes, and enables retries — at the cost of eventual consistency and complexity.
- Queue = one consumer per message (task distribution). Pub/sub = every subscriber gets a copy (fan-out). Log/stream (Kafka) = retained, replayable, ordered per partition, consumer groups.
- Assume at-least-once delivery: idempotent consumers, bounded retries, DLQs, monitor consumer lag.
- The outbox pattern (plus CDC) solves the dual-write problem.
- CQRS separates reads and writes; event sourcing stores the history of changes as the source of truth.
- Batch = bounded data, high latency; stream = unbounded data, low latency.

---

## Part 12: Architecture Styles

### 12.1 Monolith

A **monolith** is a single deployable application containing all features (users, orders, payments, notifications), usually with one database.

```mermaid
flowchart LR
    C["Clients"] --> LB["Load Balancer"]
    LB --> M1["Monolith instance"]
    LB --> M2["Monolith instance"]
    M1 --> DB[("Single database")]
    M2 --> DB
```

- **Pros:** simple to develop, test, deploy, and debug; function calls instead of network calls (fast, no partial failures); easy transactions across features; one codebase to understand.
- **Cons:** as the codebase and team grow, it becomes harder to change safely; one bug can crash everything; must scale all parts together; deployments get slow and risky; one technology stack.

Note: a monolith can still be **horizontally scaled** (many identical instances behind a load balancer). "Monolith" is about **deployment units**, not about running on one machine.

### 12.2 Modular Monolith

A monolith with **strict internal module boundaries** (separate modules with clear interfaces, each owning its own tables), deployed as one unit. It gets most of the organizational benefits of microservices without distributed-systems pain, and modules can later be extracted into services. Increasingly seen as the right starting point for most products.

### 12.3 Microservices

**Microservices** split the system into small, **independently deployable** services, each owning **one business capability** and **its own data**.

```mermaid
flowchart LR
    C["Clients"] --> GW["API Gateway"]
    GW --> U["User Service"]
    GW --> O["Order Service"]
    GW --> P["Payment Service"]
    U --> UDB[("Users DB")]
    O --> ODB[("Orders DB")]
    P --> PDB[("Payments DB")]
    O -->|"events"| K["Kafka"]
    K --> N["Notification Service"]
    K --> P
```

**Key principles:**
- **Database per service** — no service reads another service's tables directly; data is accessed through APIs or events. (Otherwise you have a "distributed monolith": all the costs, none of the independence.)
- Services are organized around **business capabilities / bounded contexts** (a term from **DDD — Domain-Driven Design**).
- Each service can be deployed, scaled, and written in a technology of its own choosing.

| Pros | Cons |
|---|---|
| Independent deployments → teams move fast | Network calls: latency, partial failures, retries |
| Scale each service independently | Distributed data: no cross-service joins or ACID transactions (sagas needed) |
| Fault isolation (if well designed) | Operational overhead: many deployments, monitoring, tracing |
| Technology flexibility per service | Harder testing and debugging across services |
| Clear ownership for teams | Service boundaries are hard to get right; wrong splits are costly |

**Conway's Law:** "Organizations design systems that mirror their communication structure." Microservices work best when each service is owned by a team — they're as much an organizational tool as a technical one.

**When to choose:** large organizations with many teams, parts of the system with very different scaling needs, a mature DevOps culture. **For a new product or small team, start with a (modular) monolith.**

### 12.4 Service Discovery

With many dynamic service instances (autoscaling, containers restarting with new IPs), how does service A find service B?

- **Service registry** — instances register themselves (address, health) in a registry: **Consul**, etcd, Eureka, or the Kubernetes API.
- **Client-side discovery** — the client asks the registry and load-balances itself.
- **Server-side discovery** — the client calls a stable name or load balancer that routes to a healthy instance. In Kubernetes, a **Service** gets a stable DNS name (`orders.default.svc.cluster.local`) that routes to healthy pods.

### 12.5 Service Mesh and Sidecars

A **service mesh** (Istio, Linkerd) moves networking concerns out of application code into a **sidecar proxy** (usually Envoy) deployed next to every service instance. The sidecars handle **mTLS**, retries, timeouts, circuit breaking, load balancing, and telemetry uniformly for all services, configured centrally. Useful at large microservice scale; significant operational complexity.

### 12.6 Serverless

**Serverless** means you run code without managing servers; the cloud provider scales it automatically and bills per use.

- **FaaS (Function as a Service)** — AWS Lambda, Google Cloud Functions, Azure Functions, Cloudflare Workers: a function runs in response to an event (HTTP request, queue message, file upload, schedule).
- Serverless also includes managed services like DynamoDB, S3, SQS, Aurora Serverless.

| Pros | Cons |
|---|---|
| No server management | **Cold starts** (first invocation latency, from ~100 ms to seconds) |
| Automatic scaling, including to zero | Execution time limits (for example 15 minutes on Lambda) |
| Pay per request — cheap at low or spiky load | Expensive at sustained high load |
| Great for event-driven glue code | Stateless; connection management to databases is tricky (use pooling proxies) |
| | Vendor lock-in; harder local testing |

**Good fits:** event handlers (process an uploaded image), webhooks, scheduled tasks, spiky or low-traffic APIs, glue between managed services.

### 12.7 Comparison and Migration

| | Monolith | Modular monolith | Microservices | Serverless |
|---|---|---|---|---|
| Deployment unit | One | One | Many services | Many functions |
| Complexity | Low | Low–medium | High | Medium |
| Team scaling | Poor at large size | Good | Best | Good |
| Independent scaling | No | No | Yes | Yes (per function) |
| Best for | Small teams, early products | Most products | Large orgs, complex domains | Event-driven, spiky workloads |

**Migrating from a monolith:** use the **Strangler Fig pattern** — put a proxy/gateway in front of the monolith and gradually route specific features to new services until the monolith withers away. Avoid "big-bang" rewrites.

**Key takeaways**
- Monolith = one deployable (simple); microservices = many independently deployable services, each owning its data (scalable organizationally, complex technically).
- Start with a modular monolith; extract services when team or scaling needs justify it.
- Microservices need service discovery, API gateways, observability, and sagas for cross-service consistency.
- Serverless = no server management, pay per use; watch cold starts, time limits, and cost at high steady load.

---

## Part 13: Reliability and Resilience Patterns

**Everything fails, all the time** (Werner Vogels, Amazon CTO). Disks die, networks partition, deployments contain bugs, dependencies slow down, whole data centers lose power. Resilient systems **expect** failures and limit their impact.

### 13.1 Kinds of Failures

- **Crash failures** — a process or machine stops.
- **Omission failures** — messages lost.
- **Timing / performance failures** — responses too slow (often worse than crashes, because slow components hold resources and spread slowness).
- **Byzantine failures** — components behave arbitrarily or maliciously (mostly relevant in blockchains; ignored in typical system design).
- **Correlated failures** — many components fail together (same rack, same bad deploy, same region, same expired certificate).
- **Cascading failures** — one component's failure overloads others, which then fail too, spreading through the system.

**Identify SPOFs (Single Points Of Failure):** walk through each box in your diagram and ask, "What happens if this dies?" Every SPOF needs redundancy or an accepted risk.

### 13.2 Redundancy and Failover

**Redundancy** = having more than one of each critical component. **Failover** = switching to a backup when the primary fails.

| | Active-passive (hot standby) | Active-active |
|---|---|---|
| How | One instance serves traffic; a standby takes over on failure | All instances serve traffic simultaneously |
| Resource use | Standby mostly idle (wasteful) | Everything used |
| Failover | Takes time (detection + promotion); may lose in-flight data | Instant — remaining nodes absorb load |
| Complexity | Simpler, no write conflicts | Harder for stateful systems (write conflicts, consistency) |
| Typical | Relational database primary + standby | Stateless app servers, multi-region reads, Cassandra |

Standby "temperatures": **hot** (running, in sync, instant takeover), **warm** (running, partially ready), **cold** (must be started and loaded — slow, cheap).

**Capacity for failure:** if 3 servers run at 80% load and one dies, the other 2 must take 120% each → they fail too (a cascade). Plan headroom: **N+1** or **N+2** redundancy (enough spare capacity to lose 1 or 2 units).

### 13.3 Timeouts

**Every network call needs a timeout.** Without one, a slow dependency holds your threads, connections, and memory indefinitely; your service stops responding, and its callers hang too — a cascade.

- Set timeouts based on the dependency's normal latency (for example, a bit above its p99).
- Use a **total deadline** for the whole request and pass the remaining budget downstream (**deadline propagation**, built into gRPC).

### 13.4 Retries with Exponential Backoff and Jitter

Many failures are **transient** (a brief network blip, a restarting instance). Retrying often succeeds. But naive retries are dangerous:

- Retrying immediately and repeatedly **hammers** an already struggling service (a **retry storm**).
- If thousands of clients retry at the same fixed intervals, they hit the service in synchronized waves (**thundering herd**).

**Best practice:**

1. **Retry only transient errors** (timeouts, `503`, `429`, connection resets) — not `400 Bad Request` or `404`.
2. **Retry only idempotent operations** (or use idempotency keys).
3. **Exponential backoff** — wait 100 ms, 200 ms, 400 ms, 800 ms, ... between attempts.
4. **Jitter** — randomize the waits so clients don't synchronize.
5. **Cap** the number of attempts and the maximum delay.
6. **Retry budgets** — limit retries to a percentage of total traffic (for example 10%), so retries can't multiply load during an outage.

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 5,
  baseDelayMs = 100,
  maxDelayMs = 5_000,
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await operation();
    } catch (err) {
      if (attempt >= maxAttempts || !isTransient(err)) throw err;
      // Exponential backoff with "full jitter": random delay in [0, min(cap, base * 2^attempt)]
      const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
      const delay = Math.random() * ceiling;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

function isTransient(err: unknown): boolean {
  const status = (err as { status?: number }).status;
  return status === undefined /* network error */ || status === 429 || status >= 500;
}
```

**Retries at multiple layers multiply:** if the client, the gateway, and the service each retry 3 times, one user action can cause 27 calls to the database. Retry at one layer (usually closest to the caller) where possible.

### 13.5 Circuit Breaker and Bulkhead

#### Circuit breaker

Named after electrical circuit breakers. If a dependency keeps failing, **stop calling it for a while** — fail fast instead of waiting on timeouts, and give the dependency time to recover.

```mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: failure rate exceeds threshold
    Open --> HalfOpen: after cool-down period
    HalfOpen --> Closed: trial requests succeed
    HalfOpen --> Open: trial request fails
```

- **Closed** — normal: requests flow; failures are counted.
- **Open** — requests fail immediately (or return a **fallback**: cached data, default value, degraded response) without calling the dependency.
- **Half-open** — after a cool-down, let a few trial requests through. Success → close; failure → open again.

Benefits: prevents cascading failures, frees threads and connections, speeds recovery. Libraries: resilience4j (Java), opossum (Node.js), Polly (.NET); service meshes provide it too.

#### Bulkhead

Named after a ship's watertight compartments: a leak in one doesn't sink the ship. **Isolate resources per dependency or per workload** so one misbehaving part can't exhaust everything:

- Separate connection pools / thread pools per downstream service.
- Separate queues or clusters for premium vs free customers, or for critical vs batch work.

### 13.6 Rate Limiting

**Rate limiting** controls how many requests a client can make in a time window. It protects against abuse (scraping, brute-force logins, DDoS), keeps one noisy client from starving others, and enforces paid plan quotas.

Where: at the API gateway / edge (most common), in each service, or both. Identify clients by user ID, API key, or IP address. Exceeded → `429 Too Many Requests` with `Retry-After`.

#### Algorithms

**1. Token bucket** (most common; used by AWS, Stripe)

- A bucket holds up to **B** tokens (the burst capacity); tokens are added at rate **R** per second.
- Each request takes one token; no token → rejected.
- Allows short **bursts** up to B while enforcing the average rate R.

```
Capacity B = 10, refill R = 5 tokens/s

t=0.0s  bucket 10 → burst of 10 requests → all allowed → bucket 0
t=0.1s  1 request  → bucket 0.5 → rejected (429)
t=1.0s  bucket refilled to 5 → 5 requests allowed
```

```typescript
class TokenBucket {
  private tokens: number;
  private lastRefill = Date.now();

  constructor(private capacity: number, private refillPerSecond: number) {
    this.tokens = capacity;
  }

  tryConsume(): boolean {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSeconds * this.refillPerSecond);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true; // allowed
    }
    return false; // rate limited
  }
}
```

**2. Leaky bucket** — requests enter a queue that "leaks" (is processed) at a constant rate; overflow is dropped. Produces a perfectly **smooth output rate**; good for protecting a downstream with fixed capacity. No bursts.

**3. Fixed window counter** — count requests per fixed window (for example per calendar minute: `rate:user42:10:05`). Simple and cheap (`INCR` + `EXPIRE` in Redis). Flaw: a burst at the **window boundary** — 100 requests at 10:05:59 and 100 at 10:06:00 means 200 requests in 2 seconds with a "100 per minute" limit.

**4. Sliding window log** — store the timestamp of each request; count those within the last 60 seconds. Precise, but memory-hungry (one entry per request).

**5. Sliding window counter** — approximate the sliding window using the current and previous fixed-window counts, weighted by overlap:

```
count ≈ current_window_count + previous_window_count × (fraction of previous window still inside the sliding window)

Example: limit 100/min, now is 15 s into the current minute
previous minute = 80 requests, current minute so far = 30
count ≈ 30 + 80 × (45/60) = 30 + 60 = 90 → allowed
```

Cheap and accurate enough; widely used.

| Algorithm | Bursts | Memory | Accuracy | Notes |
|---|---|---|---|---|
| Token bucket | Allowed up to capacity | Low | Good | Most popular default |
| Leaky bucket | Smoothed out | Low | Good | Constant output rate |
| Fixed window | Boundary bursts | Lowest | Weak at edges | Simplest |
| Sliding window log | No | High | Exact | Expensive at scale |
| Sliding window counter | Minimal | Low | Approximate, good | Great balance |

#### Distributed rate limiting

With many gateway instances, counters must be shared — usually in **Redis**, with atomic operations or a Lua script (so "read count, check, increment" happens atomically). For extreme scale, each node can keep local counters and sync periodically, accepting slight inaccuracy.

### 13.7 Load Shedding, Backpressure, and Graceful Degradation

- **Load shedding** — when overloaded, **deliberately reject** some requests (fast `503`) to keep serving the rest well, instead of slowing down for everyone. Shed low-priority traffic first (background syncs, prefetches) before critical traffic (checkout, login).
- **Backpressure** — push "slow down" signals upstream (bounded queues, rejecting enqueues, flow control) instead of buffering unboundedly.
- **Graceful degradation** — when a non-critical dependency fails, keep the core working with reduced functionality. Netflix example: if the personalized recommendation service is down, show a generic "popular now" list instead of an error page. E-commerce: if reviews are down, show the product page without reviews.
- **Feature flags / kill switches** — turn off expensive features under load.

### 13.8 Multi-AZ and Multi-Region Architecture

Cloud providers are organized into **regions** (geographic areas, like `eu-central-1` Frankfurt) containing multiple **AZs (Availability Zones)** — physically separate data centers with independent power and networking, connected by fast links (~1–2 ms apart).

```mermaid
flowchart TB
    subgraph R1["Region: eu-central-1"]
        subgraph AZ1["AZ a"]
            A1["App"]
            D1[("DB primary")]
        end
        subgraph AZ2["AZ b"]
            A2["App"]
            D2[("DB standby")]
        end
        LB["Regional load balancer"] --> A1
        LB --> A2
        D1 -->|"synchronous replication"| D2
    end
    subgraph R2["Region: us-east-1"]
        A3["App"]
        D3[("DB replica")]
    end
    D1 -.->|"asynchronous cross-region replication"| D3
```

- **Multi-AZ** (standard practice): survives a data center failure. Synchronous replication is feasible because AZs are close.
- **Multi-region**: survives an entire region failure, and serves global users with lower latency. Cross-region latency (50–150+ ms) usually forces **asynchronous** replication → possible data loss on failover (RPO > 0) and consistency challenges.
  - **Active-passive multi-region**: one region serves; another is ready for failover.
  - **Active-active multi-region**: all regions serve traffic; needs conflict handling (multi-leader, CRDTs) or partitioning users by home region.

### 13.9 Disaster Recovery Strategies

Recall **RPO** (acceptable data loss) and **RTO** (acceptable downtime) from Section 4.5. Standard strategies, from cheapest to most expensive:

| Strategy | Description | RPO / RTO | Cost |
|---|---|---|---|
| **Backup and restore** | Regular backups stored in another region; rebuild everything after a disaster | Hours / hours to a day | $ |
| **Pilot light** | Core components (data replication) always running in the DR region; the rest started on demand | Minutes / tens of minutes to hours | $$ |
| **Warm standby** | A scaled-down but fully working copy runs in the DR region; scale up on failover | Seconds to minutes / minutes | $$$ |
| **Multi-site active-active** | Full capacity in multiple regions serving traffic | Near zero / near zero | $$$$ |

Backup essentials: automate backups, store copies in a separate region/account, use **point-in-time recovery** where available, and — most importantly — **regularly test restores**. An untested backup is not a backup.

### 13.10 Health Checks and Chaos Engineering

- **Health checks**: liveness vs readiness (Section 6.4). Deep health checks (checking dependencies) can cause cascading removal of all instances when a shared dependency blips — be careful what "unhealthy" means.
- **Chaos engineering**: deliberately inject failures in production-like environments (kill instances, add latency, cut network links) to verify the system tolerates them. Pioneered by Netflix's **Chaos Monkey**. You don't know your system is resilient until you've seen it survive failures.
- **Game days**: planned exercises simulating major incidents to practice response.

**Key takeaways**
- Find and remove SPOFs; plan N+1 capacity so losing a node doesn't cascade.
- Every network call needs a timeout. Retry only transient errors on idempotent operations, with exponential backoff, jitter, and limits.
- Circuit breakers fail fast when a dependency is unhealthy; bulkheads isolate resources.
- Rate limiting: token bucket (bursty, popular), leaky bucket (smooth), fixed/sliding windows. Distributed limits use Redis.
- Under overload: shed load, apply backpressure, degrade gracefully.
- Multi-AZ is standard; multi-region protects against regional failure at the cost of async replication and complexity.
- DR strategies trade cost for RPO/RTO: backup/restore → pilot light → warm standby → active-active. Test your restores.

---

## Part 14: Specialized Data Structures for Scale

These data structures show up repeatedly as "the trick" in system design deep dives. Many are **probabilistic**: they trade a small, controlled error for enormous savings in memory and time.

### 14.1 Bloom Filter — "Have I Seen This Before?"

A **Bloom filter** is a compact structure that answers set membership:

- **"Definitely not in the set"** — always correct.
- **"Probably in the set"** — may be a **false positive**.

**No false negatives, possible false positives.**

#### How it works

1. A bit array of **m** bits, all 0, and **k** different hash functions.
2. **Add** item: compute its k hashes, set those k bit positions to 1.
3. **Check** item: compute its k hashes. If **any** of those bits is 0 → definitely not present. If **all** are 1 → probably present (the bits may have been set by other items).

```
Bit array (m = 16), k = 3 hash functions

Add "alice": hashes → 2, 7, 11
index:  0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
bits:   0 0 1 0 0 0 0 1 0 0 0  1  0  0  0  0

Add "bob": hashes → 4, 7, 13
bits:   0 0 1 0 1 0 0 1 0 0 0  1  0  1  0  0

Check "carol": hashes → 2, 5, 13 → bit 5 is 0 → definitely NOT present
Check "dave":  hashes → 2, 4, 11 → all 1     → "probably present" (false positive!)
```

- Memory: roughly **10 bits per item for a ~1% false positive rate**, regardless of item size. One billion URLs ≈ 1.2 GB instead of hundreds of GB.
- Standard Bloom filters **can't delete** items (clearing a bit may affect other items); **Counting Bloom filters** or **Cuckoo filters** support deletion.

#### Uses

- **Databases (LSM trees)**: skip SSTables that definitely don't contain a key (Cassandra, RocksDB, HBase).
- **Web crawlers**: "have we already crawled this URL?"
- **Cache penetration protection**: reject lookups for keys that definitely don't exist (Section 7.6).
- **Username availability check**: fast "definitely available" answers; confirm "probably taken" against the database.
- **Recommendations**: "has this user already seen this article?"

### 14.2 Count-Min Sketch — "Roughly How Many Times?"

A **Count-Min Sketch** estimates the **frequency** of items in a stream using fixed memory.

- A 2D array of counters: **d rows** (one hash function each) × **w columns**.
- **Add** item: for each row, hash the item to a column and increment that counter.
- **Estimate** count: take the **minimum** of the item's counters across rows (collisions only ever inflate counts, so the minimum is the best estimate).
- Never underestimates; may overestimate slightly.

**Uses:** **top-K / heavy hitters** (trending hashtags, most-viewed videos, top search queries) combined with a small heap of current leaders; detecting abusive IPs; network traffic analysis. Classic in "design trending topics" or "top K songs" questions.

### 14.3 HyperLogLog — "Roughly How Many Unique?"

**HyperLogLog (HLL)** estimates the **number of distinct items** (cardinality) using tiny, fixed memory.

- Intuition: hash each item; the rarer patterns you observe (like a hash starting with many leading zeros), the more distinct items you've probably seen — like guessing how many coin-flip sequences someone did from the longest run of heads they report. Averaging over many buckets makes it accurate.
- Redis's HLL uses about **12 KB** per counter to count up to billions of unique items with **~0.81% standard error**.
- HLLs can be **merged** (union) — combine daily counters into a monthly one.

**Uses:** unique visitors per page, DAU/MAU, unique search queries, distinct IPs. Compare: storing 100 million user IDs in a set for exact counting takes gigabytes; HLL takes kilobytes.

### 14.4 Geospatial Indexing — "What's Near Me?"

Problems like "find restaurants within 2 km" or "nearest available drivers" need efficient 2D proximity search. A normal index on latitude and longitude separately doesn't work well (it can filter one dimension at a time, not a circle).

#### Geohash

A **geohash** encodes a (latitude, longitude) point into a short string by recursively splitting the world into a grid. **Longer strings = smaller cells**, and **points that share a prefix are close together**.

```
Paris (Eiffel Tower) ≈ "u09tunq..."
All points starting with "u09tu" are within the same ~5 km × 5 km cell
```

| Geohash length | Approximate cell size |
|---|---|
| 4 | ~39 km × 20 km |
| 5 | ~4.9 km × 4.9 km |
| 6 | ~1.2 km × 0.6 km |
| 7 | ~153 m × 153 m |

- Proximity search becomes a **prefix search** on a normal B-tree index or a key lookup: `WHERE geohash LIKE 'u09tu%'`.
- **Edge problem:** two nearby points on opposite sides of a cell boundary can have very different geohashes → always search the target cell **plus its 8 neighbors**.
- Built into Redis (`GEOADD`, `GEOSEARCH`), Elasticsearch, and others.

#### Quadtree

A **quadtree** recursively divides a 2D area into four quadrants, splitting a cell only when it contains more than N points. Dense cities get small cells; oceans stay as big cells — it **adapts to density**. Typically kept in memory; great for "find K nearest" queries.

```
+---------+---------+
|         |  +--+--+|
|   NW    |  |  |..||    NE split further because it is dense
|         |  +--+--+|
+---------+---------+
|         |         |
|   SW    |   SE    |
+---------+---------+
```

#### Other options

- **R-tree** — indexes rectangles/shapes; used by PostGIS (PostgreSQL's geospatial extension).
- **Google S2** (sphere divided into hierarchical cells) and **Uber H3** (hexagonal grid) — cell-ID systems used at large scale for ride-sharing and mapping.

**Rule of thumb:** for most designs, "PostGIS or Redis GEO or Elasticsearch geo queries" is a fine answer; explain geohash or quadtree if asked how it works. For rapidly changing locations (drivers updating every few seconds), keep them in an in-memory store like Redis rather than rewriting a disk-based index constantly.

### 14.5 Trie — Autocomplete

A **trie** (prefix tree) stores strings character by character; all words sharing a prefix share a path.

```mermaid
flowchart TB
    R["root"] --> C["c"]
    C --> CA["ca"]
    CA --> CAT["cat - word"]
    CA --> CAR["car - word"]
    CAR --> CARD["card - word"]
    R --> D["d"]
    D --> DO["do"]
    DO --> DOG["dog - word"]
```

For **typeahead / autocomplete**, each node can store the **top-K most popular completions** for that prefix, so a lookup is just walking down the prefix — O(length of prefix) — then returning the precomputed list. The popularity data is computed offline (batch jobs over search logs) and the trie is rebuilt periodically; hot prefixes are cached at the CDN or in Redis.

### 14.6 Inverted Index — Full-Text Search

An **inverted index** maps each **term** to the list of documents containing it (a **posting list**), often with positions and frequencies.

```
Documents:
  d1: "fast red car"
  d2: "red apple"
  d3: "fast delivery"

Inverted index:
  "fast"     → [d1, d3]
  "red"      → [d1, d2]
  "car"      → [d1]
  "apple"    → [d2]
  "delivery" → [d3]

Query "fast red" → intersect [d1, d3] ∩ [d1, d2] = [d1]
```

Before indexing, text is **analyzed**: tokenized, lowercased, stop words removed, and words reduced to their root (**stemming**: "running" → "run"). Results are ranked by relevance scores such as **TF-IDF (Term Frequency – Inverse Document Frequency)** or **BM25**. This is what Elasticsearch/Lucene does under the hood.

### 14.7 Skip Lists, Heaps, and Leaderboards

- **Skip list** — a sorted linked list with "express lanes" (multiple levels of forward pointers), giving O(log n) search, insert, and delete with simpler concurrency than balanced trees. **Redis sorted sets** use skip lists (plus a hash map), which is why `ZADD`, `ZRANK`, and `ZREVRANGE` are O(log n) and perfect for **leaderboards**.
- **Heap / priority queue** — keep the top K items of a stream in a min-heap of size K: O(n log K). The standard tool for "top K" (and a staple of coding interviews too).

### 14.8 Merkle Tree — Comparing Large Datasets Efficiently

A **Merkle tree** is a tree of hashes: leaves are hashes of data blocks; each parent is the hash of its children; the root summarizes everything.

```mermaid
flowchart TB
    ROOT["Root = hash of H12 and H34"] --> H12["H12 = hash of H1 and H2"]
    ROOT --> H34["H34 = hash of H3 and H4"]
    H12 --> H1["H1 = hash of block 1"]
    H12 --> H2["H2 = hash of block 2"]
    H34 --> H3["H3 = hash of block 3"]
    H34 --> H4["H4 = hash of block 4"]
```

To check whether two replicas hold identical data, compare their roots. If roots differ, compare children and descend only into subtrees that differ — you find the differing blocks in O(log n) comparisons instead of transferring everything.

**Uses:** anti-entropy repair between replicas (Cassandra, DynamoDB-style systems), Git (commits and trees), blockchains, file synchronization (detecting which chunks changed), certificate transparency logs.

### 14.9 Summary

| Structure | Answers | Error | Typical use |
|---|---|---|---|
| Bloom filter | "Is X in the set?" | False positives only | Skip lookups, crawler dedup, cache penetration |
| Count-Min Sketch | "How often has X appeared?" | Overestimates only | Top-K, heavy hitters, trending |
| HyperLogLog | "How many distinct items?" | ~1% | Unique visitors, DAU |
| Geohash / quadtree | "What's near this point?" | Exact (with neighbor search) | Nearby places, drivers |
| Trie | "Which strings start with P?" | Exact | Autocomplete |
| Inverted index | "Which documents contain these words?" | Exact | Full-text search |
| Skip list / sorted set | "Rank / range by score" | Exact | Leaderboards |
| Merkle tree | "Where do two datasets differ?" | Exact | Replica repair, sync |

**Key takeaways**
- Probabilistic structures (Bloom filter, Count-Min Sketch, HyperLogLog) trade tiny errors for huge memory savings.
- Geohashes turn 2D proximity into prefix search (remember neighboring cells); quadtrees adapt to density.
- Tries power autocomplete (store top-K per prefix); inverted indexes power search.
- Redis sorted sets (skip lists) make leaderboards trivial; Merkle trees find differences between replicas efficiently.

---

## Part 15: Common Design Patterns and Problem-Solving Techniques

This part shows how the building blocks combine to solve recurring problems. Recognizing these patterns is what lets you "see" a design quickly in an interview.

### 15.1 News Feeds: Fan-out on Write vs Fan-out on Read

"Show a user the latest posts from everyone they follow" appears in Twitter, Instagram, Facebook, LinkedIn, and many more.

#### Fan-out on read (pull model)

When a user opens their feed, **fetch recent posts from everyone they follow and merge them** at read time.

- **Pros:** writes are cheap (store the post once); no wasted work for inactive users; always fresh.
- **Cons:** reads are slow and expensive — following 500 accounts means querying 500 timelines and merging on every feed load.

#### Fan-out on write (push model)

When a user posts, **push the post ID into a precomputed feed (inbox) of each follower**, typically a list in Redis or a wide-column table.

```mermaid
flowchart LR
    A["User posts"] --> PS["Post Service"]
    PS --> DB[("Posts DB")]
    PS -->|"PostCreated event"| Q["Queue"]
    Q --> FW["Fan-out workers"]
    FW -->|"look up followers"| G[("Follower graph")]
    FW -->|"prepend post ID"| F1[("Feed cache: follower 1")]
    FW -->|"prepend post ID"| F2[("Feed cache: follower 2")]
    FW -->|"prepend post ID"| F3[("Feed cache: follower N")]
    R["Follower opens feed"] -->|"single read"| F1
```

- **Pros:** reading the feed is a single fast lookup — great for read-heavy systems (Section 5.4's 50:1 ratio).
- **Cons:** **the celebrity problem** — a user with 100 million followers creates 100 million writes per post; wasted work for inactive followers; delay before all followers see a post.

#### Hybrid (what large systems actually do)

- **Regular users** → fan-out on write.
- **Celebrities** (followers above a threshold) → fan-out on read: their posts are fetched and merged at read time.
- Feed = precomputed inbox **merged with** recent posts from the few celebrities the user follows.
- Optionally, skip fan-out to inactive users and build their feed on demand when they return.

This hybrid is one of the most famous system design trade-offs — know it well.

### 15.2 Video Streaming and Adaptive Bitrate

Streaming platforms (YouTube, Netflix) don't send one big video file:

1. **Upload** the original (often chunked and resumable, Section 15.3).
2. **Transcode** asynchronously into multiple resolutions and bitrates (240p ... 4K) and codecs, using a fleet of workers fed by a queue. Large videos are split into segments and transcoded in parallel (a **DAG — Directed Acyclic Graph** — of processing tasks).
3. **Segment** each version into small chunks (2–10 seconds) plus a **manifest** file listing them.
4. Store segments in **object storage** and serve via **CDN**.
5. The player uses **adaptive bitrate streaming (ABR)** — **HLS (HTTP Live Streaming)** or **MPEG-DASH (Dynamic Adaptive Streaming over HTTP)** — measuring network speed and choosing the quality of each next segment. Slow network → drop to 480p instead of buffering.

Because segments are plain HTTP files, they cache perfectly on CDNs — the reason video delivery scales.

### 15.3 Large File Uploads: Presigned URLs and Multipart Uploads

**Problem:** routing gigabytes of uploads through your API servers wastes their bandwidth, memory, and time.

**Presigned URL pattern:**

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant S3 as Object Storage
    participant DB as Metadata DB
    C->>API: I want to upload video.mp4, 2 GB
    API->>DB: Create file record, status UPLOADING
    API-->>C: Presigned upload URL, valid 15 minutes
    C->>S3: PUT file directly using presigned URL
    S3-->>API: Upload complete event notification
    API->>DB: Update status UPLOADED, trigger processing
```

- A **presigned URL** is a URL signed with your cloud credentials that grants **temporary, limited permission** (upload this one key, for 15 minutes). The client talks directly to storage; your servers only handle small metadata requests.
- The same idea works for **downloads** of private files (signed CDN URLs).

**Multipart / chunked uploads:** split large files into parts (for example 5–100 MB), upload them in parallel, retry only failed parts, and **resume** after network interruptions. The storage service assembles the parts at the end. Clients can also compute a **fingerprint** (hash) of each chunk to skip already-uploaded chunks (deduplication — the approach behind Dropbox-style sync).

### 15.4 Counting at Scale: Likes, Views, and Counters

**Problem:** a viral post receives 100,000 likes per second. `UPDATE posts SET likes = likes + 1 WHERE id = 42` on one row creates a massive **hot row** with lock contention.

Solutions (often combined):

1. **Sharded counters** — split the counter into N sub-counters (`likes:42:0` ... `likes:42:15`); increment a random one; sum them on read (and cache the sum).
2. **Batching / write-behind** — increment in memory or Redis (`INCR` is fast), and flush aggregated deltas to the database every few seconds.
3. **Stream aggregation** — publish like events to Kafka; a stream processor aggregates per post per time window and writes totals.
4. **Approximate counts** — show "1.2M likes"; exactness doesn't matter at that scale. Use HyperLogLog for unique viewers.

Keep a separate record of **who** liked what (for "did I like this?" and to prevent double likes, with a unique constraint on `(user_id, post_id)`), and treat the count as a derived, eventually consistent value.

### 15.5 High Contention: Bookings, Flash Sales, and Inventory

**Problem:** 50,000 people try to buy 1,000 concert tickets at the same moment. You must never oversell, and the system must survive the spike.

Techniques:

1. **Correctness at the data layer** — guarantee no double booking with pessimistic locks (`SELECT ... FOR UPDATE`), optimistic concurrency (version checks), or a conditional atomic update (`UPDATE seats SET status='HELD' WHERE id=? AND status='AVAILABLE'`). See Section 8.3.
2. **Temporary reservations with TTL** — when a user selects a seat, mark it `HELD` with an expiry (for example 10 minutes) while they pay. If payment doesn't complete, the hold expires and the seat returns to the pool. Implement with an `expires_at` column plus a cleanup job, or a Redis key with a TTL (`SET seat:A12 user42 NX EX 600`).
3. **Virtual waiting room / queue** — admit users gradually into the purchase flow (a queue with position numbers), protecting the backend and giving fair ordering. Ticketmaster-style.
4. **Pre-load inventory into Redis** and decrement atomically (`DECR` or a Lua script) as a fast gatekeeper; confirm in the database asynchronously.
5. **Rate limiting and bot protection** at the edge.
6. **Idempotent payment calls** with idempotency keys.

### 15.6 Real-Time Updates End to End

Many designs (chat, live comments, ride tracking, collaborative docs, live dashboards) share the same skeleton:

```mermaid
flowchart LR
    S["Sender client"] -->|"HTTP or WebSocket"| API["API or WS server"]
    API --> DB[("Durable store")]
    API -->|"publish"| PS["Pub/Sub: Redis, Kafka"]
    PS --> G1["Gateway server holding recipient connections"]
    G1 -->|"WebSocket or SSE push"| R["Recipient clients"]
    PS --> PN["Push notification service for offline users: APNs, FCM"]
```

Key decisions:
- **Transport** — WebSocket (bidirectional) or SSE (server → client); polling as fallback (Section 2.9).
- **Routing** — which gateway holds the recipient's connection (connection registry), and a pub/sub layer to reach it.
- **Persistence first** — store the message before acknowledging, so nothing is lost if delivery fails.
- **Offline users** — mobile push via **APNs (Apple Push Notification service)** and **FCM (Firebase Cloud Messaging)**; the client syncs missed messages on reconnect (using a last-seen message ID or sequence number).
- **Ordering and deduplication** — per-conversation sequence numbers; client-generated message IDs for idempotency.

### 15.7 Proximity Services: Nearby Places and Moving Objects

- **Static places** (restaurants, hotels): store in a database with a geospatial index (PostGIS, Elasticsearch geo, geohash column); cache popular areas. Reads dominate.
- **Moving objects** (drivers, delivery couriers): millions of location updates every few seconds → keep current locations in memory (**Redis GEO**, or an in-memory geohash/quadtree index sharded by region); persist location history asynchronously (Kafka → storage) for analytics. Matching ("find the 10 nearest available drivers") queries the in-memory index for the rider's cell and neighbors.

### 15.8 Leaderboards and Top-K

- **Exact leaderboard** (game scores): **Redis sorted set** — `ZINCRBY` to update, `ZREVRANGE 0 9` for the top 10, `ZREVRANK` for a user's rank. All O(log n). Shard by game or region if one set grows too large.
- **Top-K over huge streams** (trending hashtags, most-played songs today): stream processing with windowed aggregation; approximate with Count-Min Sketch + heap; precompute results for the last hour/day and cache them.

### 15.9 Search and Typeahead

- **Search**: primary DB → CDC/queue → Elasticsearch index; queries go to Elasticsearch; results reference IDs whose details may be fetched from cache/DB (Section 8.9).
- **Typeahead**: trie with precomputed top-K suggestions per prefix, built offline from query logs; served from memory, heavily cached (CDN/browser caching for common prefixes); client **debounces** keystrokes (waits ~100–300 ms after typing stops before sending a request).

### 15.10 Long-Running Operations

For work that takes seconds to hours (report generation, video processing, bulk imports, ML jobs):

1. Client calls `POST /reports` → server enqueues a job and returns `202 Accepted` with a job ID and status URL.
2. Workers process the job, updating its status (`QUEUED → RUNNING → DONE/FAILED`) in a database.
3. The client learns about completion by **polling** `GET /reports/{id}`, via **SSE/WebSocket** push, via a **webhook** (for server clients), or via **email/push notification**.
4. Results are stored in object storage and delivered via a (signed) URL.

### 15.11 Scaling Reads vs Scaling Writes: A Checklist

When a design needs to scale, first ask **which side is the bottleneck**.

| Scale reads | Scale writes |
|---|---|
| Caching (app cache, Redis, CDN) | Sharding / partitioning |
| Read replicas | Write-optimized storage (LSM-based: Cassandra) |
| Denormalization, materialized views, precomputation (fan-out on write) | Async processing via queues (absorb spikes) |
| CQRS read models / search indexes | Batching and write-behind |
| CDN for static and media content | Reducing write amplification (fewer indexes, smaller rows) |
| Pagination, limiting response sizes | Sharded counters for hot keys |

**Key takeaways**
- Feeds: fan-out on write for normal users, fan-out on read for celebrities (hybrid).
- Media: upload directly to object storage (presigned, multipart), process asynchronously, deliver segmented content via CDN with adaptive bitrate.
- Hot counters: shard, batch, aggregate in streams, approximate.
- Contention (tickets, inventory): enforce correctness in the database (locks or conditional updates), use TTL holds and virtual queues to manage load.
- Real-time: persistent connections + connection registry + pub/sub + push notifications for offline users.
- Know whether you're scaling reads or writes; the toolkits differ.

---

## Part 16: Security Fundamentals

Security rarely dominates an HLD interview, but senior candidates are expected to mention it naturally. The basics:

### 16.1 Authentication and Authorization Recap

- **AuthN** (who are you?) — passwords, sessions, JWTs, OAuth 2.0/OIDC, **MFA (Multi-Factor Authentication)**, **SSO (Single Sign-On)** via SAML or OIDC for enterprise customers. Details in Section 3.7.
- **AuthZ** (what can you do?) — RBAC, ABAC, ReBAC. Enforce authorization **on the server for every request**; never trust the client. Check **object-level** access (can user 42 read order 1001?) — missing this is the most common real-world API vulnerability (**BOLA — Broken Object Level Authorization**, also called **IDOR — Insecure Direct Object Reference**).

### 16.2 Encryption

- **In transit** — TLS everywhere: client to edge, and ideally between internal services (mTLS).
- **At rest** — encrypt disks, databases, backups, and object storage (for example AES-256). Cloud **KMS (Key Management Service)** manages keys; **envelope encryption** encrypts data with a data key, which is itself encrypted by a master key in the KMS.
- **End-to-end encryption (E2EE)** — only the communicating users hold the keys; the server can't read the content (Signal, WhatsApp). This limits server-side features like search.

### 16.3 Hashing and Password Storage

- **Never store passwords** in plain text or with fast hashes (MD5, SHA-256 alone).
- Use slow, salted password hashing algorithms: **bcrypt**, **scrypt**, or **Argon2**. A **salt** (random value per user) prevents precomputed-table attacks; slowness makes brute force expensive.
- Hashing ≠ encryption: hashing is one-way (verify, never recover); encryption is reversible with the key.

### 16.4 Secrets Management

API keys, database passwords, and signing keys belong in a **secrets manager** (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager) — not in source code or plain config files. Rotate them regularly and grant access by least privilege.

### 16.5 Network Security

- Put databases, caches, and internal services in **private subnets** inside a **VPC (Virtual Private Cloud)**; only load balancers/gateways are public.
- **Security groups / firewalls** allow only the necessary ports between specific components.
- **WAF (Web Application Firewall)** at the edge filters malicious HTTP traffic.
- **Zero trust** — don't trust traffic just because it's "inside the network"; authenticate and authorize every service call.
- **Principle of least privilege** — every user, service, and credential gets the minimum permissions needed.

### 16.6 Common Attacks and Defenses

| Attack | What it is | Defense |
|---|---|---|
| **SQL injection** | Attacker input is executed as SQL (`' OR 1=1 --`) | Parameterized queries / ORMs; never concatenate input into SQL |
| **XSS (Cross-Site Scripting)** | Attacker's script runs in other users' browsers via unescaped content | Escape output, **CSP (Content Security Policy)** headers, `HttpOnly` cookies |
| **CSRF (Cross-Site Request Forgery)** | A malicious site makes the user's browser send authenticated requests to your site | `SameSite` cookies, CSRF tokens, avoid cookie auth for APIs |
| **SSRF (Server-Side Request Forgery)** | Attacker makes your server fetch internal URLs (like the cloud metadata endpoint) | Validate and allowlist outbound URLs, block internal ranges |
| **DDoS (Distributed Denial of Service)** | Floods of traffic from many sources overwhelm the service | CDN/edge absorption (Cloudflare, AWS Shield), rate limiting, autoscaling, WAF |
| **Brute force / credential stuffing** | Automated login attempts with guessed or leaked passwords | Rate limiting per account and IP, MFA, CAPTCHA, breached-password checks |
| **Man-in-the-middle** | Intercepting traffic | TLS everywhere, HSTS (HTTP Strict Transport Security) |

#### CORS (Cross-Origin Resource Sharing), briefly

Browsers enforce the **same-origin policy**: JavaScript on `app.example.com` can't read responses from `api.other.com` unless that server explicitly allows it with CORS headers (`Access-Control-Allow-Origin`). For non-simple requests, the browser first sends an `OPTIONS` **preflight** request. CORS is a browser safety mechanism, not server-side protection — it doesn't stop non-browser clients.

### 16.7 Privacy and Compliance

- **PII (Personally Identifiable Information)** — names, emails, addresses, IDs: minimize collection, encrypt, restrict access, and mask in logs.
- Regulations: **GDPR** (EU), **CCPA (California Consumer Privacy Act)**, **HIPAA (Health Insurance Portability and Accountability Act)** for US health data, **PCI DSS (Payment Card Industry Data Security Standard)** for card data. Implications: data residency (store EU data in the EU), the right to deletion (can you delete a user's data from all stores and backups?), audit logs.
- **Tokenization** — replace sensitive data (card numbers) with tokens; the real data lives in a separate, highly secured vault (or with a payment provider like Stripe, which keeps you mostly out of PCI scope).

**Key takeaways**
- Authenticate every request; authorize every object access on the server.
- TLS in transit, encryption at rest with KMS-managed keys; bcrypt/Argon2 for passwords.
- Private subnets, least privilege, secrets managers, WAF, rate limiting.
- Know the classic attacks: SQL injection, XSS, CSRF, SSRF, DDoS, and their defenses.
- Handle PII carefully; regulations drive data residency and deletion requirements.

---

## Part 17: Observability and Monitoring

You can't operate — or trust — what you can't see. **Observability** is the ability to understand what's happening inside a system from its outputs. **Monitoring** is watching known signals and alerting on problems.

### 17.1 The Three Pillars: Logs, Metrics, Traces

| Pillar | What it is | Answers | Tools |
|---|---|---|---|
| **Logs** | Timestamped records of discrete events | "What exactly happened in this request?" | ELK (Elasticsearch, Logstash, Kibana), Loki, Splunk, CloudWatch Logs |
| **Metrics** | Numeric measurements aggregated over time | "How is the system behaving overall? Is it getting worse?" | Prometheus + Grafana, Datadog, CloudWatch |
| **Traces** | The path of one request across many services, with timings | "Where did this slow request spend its time?" | OpenTelemetry, Jaeger, Zipkin, AWS X-Ray |

#### Logs

- Use **structured logs** (JSON), not free text, so they can be searched and aggregated.
- Include a **correlation ID / request ID / trace ID** in every log line, propagated across services, so you can find all logs for one request.
- Centralize logs from all instances; set retention; never log secrets or unmasked PII.

```json
{"ts":"2026-09-26T10:05:12Z","level":"error","service":"orders","traceId":"a1b2c3","userId":"u42","msg":"payment failed","errorCode":"CARD_DECLINED","latencyMs":812}
```

#### Metrics

Common metric types:
- **Counter** — only goes up (total requests, total errors).
- **Gauge** — goes up and down (current memory use, queue depth, active connections).
- **Histogram** — distribution of values (request latencies) → lets you compute p50/p95/p99.

Three popular frameworks for *what* to measure:

- **The Four Golden Signals** (Google SRE): **latency**, **traffic**, **errors**, **saturation** (how full the system is — CPU, memory, queue depth).
- **RED method** (for request-driven services): **R**ate, **E**rrors, **D**uration.
- **USE method** (for resources like CPU, disks, network): **U**tilization, **S**aturation, **E**rrors.

#### Distributed tracing

A **trace** is the full journey of one request; it consists of **spans** (one per operation: an HTTP call, a DB query), each with a start time, duration, and parent span. Trace context is propagated in headers (the W3C `traceparent` header). A trace view immediately shows that, say, 700 ms of a 900 ms request was spent waiting on the inventory service.

```
Trace a1b2c3 (total 900 ms)
├── api-gateway                    [0 ms ─────────────────────────── 900 ms]
│   └── order-service              [10 ms ────────────────────────── 890 ms]
│       ├── postgres: SELECT       [20 ms ── 60 ms]
│       ├── inventory-service      [70 ms ────────────────── 770 ms]   ← bottleneck
│       └── payment-service        [780 ms ──── 880 ms]
```

**OpenTelemetry (OTel)** is the vendor-neutral standard for generating logs, metrics, and traces.

### 17.2 Alerting

- **Alert on symptoms users feel** (error rate, latency SLO violations), not on every cause (CPU at 80% may be fine).
- **SLO-based alerting** — alert when the **error budget burn rate** is too high (for example, "at this rate we'll exhaust the monthly budget in 2 days").
- Every alert should be **actionable** and have a **runbook** (documented steps to diagnose and fix). Too many noisy alerts cause **alert fatigue**, and real problems get ignored.
- **On-call** rotations, incident response, and **blameless postmortems** (focus on system fixes, not blaming people) close the loop.

### 17.3 Dashboards and Other Signals

- Dashboards per service with golden signals, plus business metrics (orders per minute, signups) — business metrics often detect problems that technical metrics miss.
- **Synthetic monitoring** — scripted probes that regularly exercise key user journeys from outside.
- **RUM (Real User Monitoring)** — performance measured in actual users' browsers and apps.

**Key takeaways**
- Logs (what happened), metrics (how it's trending), traces (where time went across services).
- Structured logs with trace IDs; histograms for latency percentiles; OpenTelemetry as the standard.
- Measure golden signals / RED / USE. Alert on user-facing symptoms and SLO burn rates; keep alerts actionable.

---

## Part 18: Cloud and Infrastructure Fundamentals

### 18.1 Regions, Availability Zones, and Edge Locations

- **Region** — a geographic area (for example Frankfurt, Northern Virginia, Tokyo) containing multiple data centers. Choose regions near users and to satisfy data residency laws.
- **AZ (Availability Zone)** — an isolated data center (or group of them) within a region, with independent power, cooling, and networking. Deploying across **at least 2–3 AZs** is the standard baseline for high availability.
- **Edge locations / PoPs** — many smaller sites worldwide used by CDNs and DNS services, much closer to users than regions.

### 18.2 Compute Models

| Model | You manage | Examples | Good for |
|---|---|---|---|
| **Bare metal** | Everything | Dedicated physical servers | Maximum performance and control |
| **VMs (Virtual Machines)** | OS and up | AWS EC2, GCP Compute Engine, Azure VMs | Full control, legacy apps, databases you run yourself |
| **Containers** | Application + its dependencies | Docker on Kubernetes (EKS, GKE, AKS), AWS ECS/Fargate, Cloud Run | Microservices, consistent deployments, efficient packing |
| **Serverless functions (FaaS)** | Just the code | AWS Lambda, Cloud Functions, Azure Functions | Event-driven, spiky workloads |
| **PaaS (Platform as a Service)** | App code and config | Heroku, App Engine, Vercel, Render | Fast shipping, small teams |

**IaaS (Infrastructure as a Service)**, **PaaS**, and **SaaS (Software as a Service)** describe how much the provider manages: IaaS gives you infrastructure (VMs), PaaS a platform to deploy code, SaaS a finished product (Gmail, Salesforce).

### 18.3 Containers and Docker

A **container** packages an application with its dependencies (runtime, libraries, config) into an isolated unit that runs the same everywhere. Unlike a VM, containers share the host's OS kernel, so they're lightweight (start in seconds or less, megabytes instead of gigabytes).

- **Image** — the immutable blueprint (built from a `Dockerfile`), stored in a **registry** (Docker Hub, Amazon ECR).
- **Container** — a running instance of an image.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 18.4 Kubernetes Basics

**Kubernetes (K8s)** is a **container orchestrator**: you declare the desired state ("run 5 copies of the orders service, version 1.4"), and it continuously makes reality match — scheduling containers onto machines, restarting failures, scaling, and rolling out updates.

| Object | What it is |
|---|---|
| **Cluster** | A set of machines (**nodes**) managed by a **control plane** |
| **Pod** | The smallest deployable unit: one or more containers sharing network and storage |
| **Deployment** | Manages a set of identical pods: desired replica count, rolling updates, rollbacks |
| **Service** | A stable virtual IP and DNS name that load-balances to healthy pods |
| **Ingress** | HTTP routing from outside the cluster to services (an L7 entry point) |
| **ConfigMap / Secret** | Configuration and sensitive values injected into pods |
| **HPA (Horizontal Pod Autoscaler)** | Adds/removes pods based on CPU, memory, or custom metrics |
| **StatefulSet** | Like a Deployment but with stable identities and storage — for databases and Kafka |
| **Namespace** | A logical partition of the cluster (per team or environment) |

Kubernetes also runs **liveness** and **readiness probes** (Section 6.4) to restart unhealthy pods and keep unready ones out of load balancing.

### 18.5 Autoscaling

- **Horizontal autoscaling** — add/remove instances based on metrics (CPU > 70%, requests per instance, queue depth / consumer lag).
- **Scheduled scaling** — scale up before known peaks (9 AM, a planned sale).
- **Predictive scaling** — scale based on forecasted load.
- Caveats: scaling takes time (new instances boot, warm caches, open connections), so keep headroom and scale out early; scale in slowly to avoid oscillation ("flapping"); downstream dependencies (the database) must handle the increased load too.

### 18.6 Infrastructure as Code, CI/CD, and Deployments

- **IaC (Infrastructure as Code)** — define infrastructure in versioned code (**Terraform**, AWS CloudFormation, Pulumi, AWS CDK) so environments are reproducible and reviewable.
- **CI (Continuous Integration)** — every change is automatically built and tested.
- **CD (Continuous Delivery / Deployment)** — every passing change is automatically deployable (delivery) or deployed (deployment) to production.

#### Deployment strategies

| Strategy | How it works | Pros | Cons |
|---|---|---|---|
| **Recreate** | Stop old version, start new | Simple | Downtime |
| **Rolling update** | Replace instances a few at a time | No downtime, no extra capacity | Old and new versions run side by side; slow rollback |
| **Blue-green** | Run the new version (green) alongside the old (blue); switch all traffic at once | Instant switch and instant rollback | Double capacity during deploy |
| **Canary** | Send a small percentage of traffic (1% → 10% → 50% → 100%) to the new version while watching metrics | Limits blast radius; data-driven rollout | More tooling (traffic splitting, automated analysis) |
| **Feature flags** | Deploy code dark; enable features per user/percentage at runtime | Decouple deploy from release; instant kill switch | Flag debt; testing combinations |

**Database changes** require care: use **backward-compatible migrations** (the **expand-and-contract** pattern: add new column → deploy code writing both → backfill → switch reads → remove old column) so old and new application versions can run simultaneously.

### 18.7 Cloud Service Map

The same concepts have different product names across providers. Knowing the mapping lets you speak concretely in interviews:

| Concept | AWS | GCP | Azure |
|---|---|---|---|
| Virtual machines | EC2 | Compute Engine | Virtual Machines |
| Managed Kubernetes | EKS | GKE | AKS |
| Serverless containers | Fargate, App Runner | Cloud Run | Container Apps |
| Serverless functions | Lambda | Cloud Functions | Azure Functions |
| Object storage | S3 | Cloud Storage | Blob Storage |
| Block storage | EBS | Persistent Disk | Managed Disks |
| Managed relational DB | RDS, Aurora | Cloud SQL, AlloyDB, Spanner | Azure SQL, Database for PostgreSQL |
| Key-value / document NoSQL | DynamoDB | Firestore, Bigtable | Cosmos DB |
| In-memory cache | ElastiCache, MemoryDB | Memorystore | Azure Cache for Redis |
| Message queue | SQS | Pub/Sub, Cloud Tasks | Service Bus Queues, Storage Queues |
| Pub/sub notifications | SNS, EventBridge | Pub/Sub | Service Bus Topics, Event Grid |
| Event streaming | Kinesis, MSK (managed Kafka) | Pub/Sub, Managed Kafka | Event Hubs |
| CDN | CloudFront | Cloud CDN | Azure Front Door, Azure CDN |
| DNS | Route 53 | Cloud DNS | Azure DNS |
| Load balancer | ALB (L7), NLB (L4) | Cloud Load Balancing | Application Gateway (L7), Load Balancer (L4) |
| API gateway | API Gateway | API Gateway, Apigee | API Management |
| Search | OpenSearch Service | (Elastic on GCP, Vertex AI Search) | Azure AI Search |
| Data warehouse | Redshift | BigQuery | Synapse Analytics, Fabric |
| Workflow orchestration | Step Functions | Workflows | Logic Apps, Durable Functions |
| Secrets | Secrets Manager | Secret Manager | Key Vault |
| Monitoring | CloudWatch, X-Ray | Cloud Monitoring, Cloud Trace | Azure Monitor, Application Insights |

**In interviews:** generic names ("object storage," "a message queue") are usually preferred; mention a concrete product ("like S3" or "like Kafka") to show familiarity.

**Key takeaways**
- Regions contain AZs; deploy across multiple AZs for high availability; CDNs use edge locations.
- VMs → containers → serverless: increasing abstraction, decreasing control.
- Docker packages apps; Kubernetes orchestrates them (pods, deployments, services, autoscaling).
- IaC + CI/CD + safe deployment strategies (rolling, blue-green, canary, feature flags) + backward-compatible migrations.
- Know the AWS/GCP/Azure names for core building blocks.

---

## Part 19: Putting It All Together — The System Design Interview

This part shows how everything in this guide is used in an actual interview, then walks through a complete example so you can see the vocabulary in action.

### 19.1 What Interviewers Evaluate

| Signal | What it looks like |
|---|---|
| **Problem navigation** | You clarify scope, prioritize the most important features, and don't get lost |
| **Solution design** | Your design works end to end and meets the requirements |
| **Technical depth** | You can go deep on the hard parts (the "deep dives") with correct details |
| **Trade-off reasoning** | You compare options and justify choices against requirements |
| **Communication** | You think out loud, structure your answer, and collaborate with the interviewer |

**Level expectations (roughly):**
- **Mid-level:** a working high-level design, reasonable technology choices, can go deeper when prompted.
- **Senior:** drives the conversation, anticipates bottlenecks and failure modes, proactively goes deep on 2–3 hard areas, discusses trade-offs fluently.
- **Staff+:** additionally frames the problem, discusses evolution over time, operational concerns, cost, and organizational impact.

### 19.2 A Step-by-Step Framework

A common structure for a 45–60 minute interview:

```mermaid
flowchart LR
    R["1. Requirements: 5 min"] --> E["2. Estimation if useful: 2 to 5 min"]
    E --> C["3. Core entities: 2 min"]
    C --> A["4. API: 5 min"]
    A --> H["5. High-level design: 10 to 15 min"]
    H --> D["6. Deep dives: 10 to 15 min"]
    D --> W["7. Wrap-up: bottlenecks, trade-offs, evolution"]
```

#### Step 1 — Requirements

**Functional requirements** — what the system does, as "users should be able to..." statements. Pick the **top 3 or so**; explicitly put others out of scope.

**Non-functional requirements** — the qualities that shape the architecture. Make them **specific and quantified**:

- Scale: "100M DAU, 10k writes/s peak."
- Latency: "Feed loads in under 200 ms at p99."
- Availability vs consistency: "Highly available for browsing; strongly consistent for bookings" (CAP per feature).
- Durability: "Messages must never be lost."
- Other: security, compliance, cost, real-time requirements, read/write ratio.

Good non-functional requirements **drive decisions**; "the system should be scalable" doesn't.

#### Step 2 — Estimation (only where it informs decisions)

QPS, storage, bandwidth, cache size (Part 5). Say what each number implies: "4k reads/s is fine for a cached single database; 2 PB means we must partition."

#### Step 3 — Core entities

The main nouns and their key relationships: `User`, `Post`, `Follow`, `Like`. Details come later.

#### Step 4 — API

Define endpoints that satisfy each functional requirement (usually REST):

```
POST /posts            { text, mediaIds[] }       → 201 { postId }
GET  /feed?cursor=...                              → 200 { posts[], nextCursor }
POST /posts/{id}/likes                             → 204
```

Mention authentication (the user is identified by a token, never by a user ID in the body), pagination, and idempotency where relevant.

#### Step 5 — High-level design

Draw the boxes and arrows to satisfy each functional requirement, one at a time: clients → load balancer/API gateway → services → databases, caches, queues, object storage, CDN. Walk through the **data flow** of each main operation. Keep it simple first; optimize in the deep dives.

#### Step 6 — Deep dives

Revisit the non-functional requirements and harden the design: scaling bottlenecks, hot keys, consistency, failure handling, specific algorithms (ID generation, fan-out, geospatial search, rate limiting). As a senior candidate, **propose** the deep dives yourself: "The hardest parts here are X and Y; let me go deeper on X."

#### Step 7 — Wrap-up

Summarize, name remaining bottlenecks and failure modes, monitoring, and how the design would evolve with 10× scale.

### 19.3 Useful Phrases for Trade-off Discussions

- "The main trade-off here is **consistency versus availability**: for this feature I'd favor..."
- "This is **read-heavy** (about 100:1), so I'll optimize the read path with caching and precomputation."
- "To avoid a **single point of failure**, I'll replicate this across availability zones."
- "This introduces **eventual consistency** — a user may see a count a few seconds old, which is acceptable here because..."
- "The **bottleneck** at this scale will be... To address it, I'd..."
- "I'm choosing **X over Y** because our requirement is..., and Y's advantage in ... doesn't matter for us."
- "If requirements changed to ..., I would switch to ..."

### 19.4 Worked Example: Design a URL Shortener (like bit.ly)

This classic problem is small enough to cover end to end, and it uses many concepts from this guide.

#### Requirements

**Functional:**
1. Users can create a short URL for a long URL (optionally with a custom alias and expiration date).
2. Visiting a short URL redirects to the original URL.
3. (Out of scope: user accounts management UI, editing links, detailed analytics dashboards — though we'll collect click events.)

**Non-functional:**
- **Low-latency redirects**: p99 under ~100 ms (redirects are on the critical path of every click).
- **High availability** for redirects (99.99%): a dead short link breaks other people's websites, emails, and printed ads.
- **Short codes are unique** — two long URLs must never share a code.
- **Scale:** 100M new URLs per month; read:write ratio ≈ 100:1.
- Eventual consistency is acceptable for analytics; a newly created link should work within a second or two.

#### Estimation

```
Writes: 100M/month ÷ ~2.5M seconds/month ≈ 40 writes/s (peak ~100/s)
Reads:  100 × writes ≈ 4,000 redirects/s (peak ~10,000–20,000/s)
Storage: ~500 bytes per record × 1.2B records/year ≈ 600 GB/year → ~3 TB over 5 years
Code length: 6B URLs over 5 years; base62: 62^7 ≈ 3.5 trillion → 7 characters is plenty
```

**What this tells us:** writes are tiny; reads are moderate but must be fast; 3 TB fits comfortably in one modern database (or a small partitioned key-value store). The real challenges are **unique code generation** and **fast, highly available redirects**.

#### Core entities

- **URL mapping**: `short_code` (primary key), `long_url`, `created_at`, `expires_at`, `user_id` (optional).
- **User** (optional, for ownership and rate limiting).

#### API

```
POST /urls
Body:     { "longUrl": "https://example.com/very/long/path", "customAlias": "promo", "expiresAt": "2027-01-01" }
Response: 201 Created { "shortUrl": "https://sho.rt/aZ3kP9q" }

GET /{shortCode}
Response: 302 Found
          Location: https://example.com/very/long/path
```

**301 vs 302:**
- **301 Moved Permanently** — browsers cache the redirect, so repeat clicks may never reach our servers: lower load, but we lose click analytics and can't change or expire the link reliably.
- **302 Found (temporary)** — every click reaches us: accurate analytics, links can expire. Most shorteners use **302** (or 307) for this reason.

#### High-level design

```mermaid
flowchart LR
    U["Users and browsers"] --> CDN["CDN or edge"]
    CDN --> LB["Load balancer / API gateway: rate limiting"]
    LB --> WS["Write service: create URLs"]
    LB --> RS["Redirect service"]
    WS --> IDG["ID range allocator: Redis INCR"]
    WS --> DB[("URL store: key-value or PostgreSQL")]
    RS --> C[("Redis cache")]
    RS --> DB
    RS -->|"click events, async"| K["Kafka"]
    K --> AN["Analytics pipeline to OLAP store"]
```

**Create flow:** client → write service → get a unique ID → encode to a short code → store the mapping → return the short URL.

**Redirect flow:** client → redirect service → look up the code in Redis (cache-aside) → on miss, read from the database and populate the cache → return `302` with `Location` → asynchronously publish a click event.

Redirect and write paths are **separate services** because they have very different load (100:1) and availability needs; each scales independently. Both are **stateless** behind the load balancer.

#### Deep dive 1: Generating unique short codes

**Option A — Hash the long URL** (for example SHA-256), base62-encode, take the first 7 characters.
- Same URL → same code (natural deduplication), but **collisions** are possible when truncating; you must check the database and retry with a salt on collision. Extra read on every write.

**Option B — Random 7-character code.**
- Simple. With 3.5 trillion possible codes, collisions are rare at first but grow with time (birthday paradox); still requires a uniqueness check (use a conditional insert: "insert if not exists").

**Option C — Global counter + base62 encoding** ✅
- Each new URL gets the next integer ID; encode it in base62: ID `125` → `"21"`, and 7 characters cover IDs up to ~3.5 trillion.
- **Guaranteed unique**, no collision checks.
- Concerns and fixes:
  - **The counter is a bottleneck / SPOF** → use a Redis `INCR` counter (100k+ ops/s, far more than our 100 writes/s), replicated; even better, each write server **reserves ranges** of 1,000 IDs at a time (`INCRBY 1000`) and assigns locally — the ticket server/range allocation pattern from Section 10.9. If a server crashes, its unused range is simply skipped.
  - **Codes are sequential and guessable** (enumeration of all links) → if that matters, apply a reversible bit-shuffling transformation to the ID before encoding, or use Option B.

```typescript
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 62 chars

function toBase62(id: bigint): string {
  if (id === 0n) return ALPHABET[0];
  let code = '';
  while (id > 0n) {
    code = ALPHABET[Number(id % 62n)] + code; // prepend next least-significant digit
    id /= 62n;
  }
  return code;
}

// toBase62(125n) === "21"   (2 × 62 + 1 = 125)
```

**Custom aliases** go through the same table with a uniqueness constraint; a conditional insert fails if the alias is taken → `409 Conflict`.

#### Deep dive 2: Fast, highly available redirects

- **Cache:** link popularity is highly skewed (a few links get most clicks), so a Redis cache-aside layer achieves very high hit ratios. Cache size: even caching 20% of all links (~600 GB after 5 years) is feasible, but caching the hot set (a few GB to tens of GB) is enough. TTL + LRU eviction.
- **Database:** access is purely by key (`short_code → long_url`), no joins → a **key-value store** (DynamoDB, Cassandra) is a natural fit and scales horizontally with no effort. **PostgreSQL** with a primary key on `short_code` also works easily at ~3 TB and 40 writes/s, plus read replicas. Either is defensible; justify by access pattern and team familiarity.
- **CDN / edge caching** of redirect responses for extremely hot links (with short TTLs, keeping in mind the analytics trade-off).
- **Availability:** stateless redirect servers across multiple AZs; replicated cache and database; the redirect path doesn't depend on the write path, the ID allocator, or analytics — if Kafka is down, redirects still work (buffer or drop click events rather than fail the redirect — graceful degradation).

#### Deep dive 3: Analytics without slowing redirects

Publish a click event (`code`, timestamp, referrer, user agent, country from IP) to **Kafka** asynchronously. A stream processor aggregates clicks per link per time window and writes to an analytics store (a columnar database like ClickHouse). Use HyperLogLog for unique visitor counts. The redirect never waits on analytics.

#### Deep dive 4: Expiration and abuse

- **Expiration:** store `expires_at`; the redirect service checks it (returning `404` or `410 Gone`); a background job periodically deletes expired rows; cache TTLs never exceed the link's remaining lifetime.
- **Abuse:** rate limit creation per user/IP (token bucket at the gateway), scan long URLs against malware/phishing lists asynchronously, and require authentication for high-volume API use.

#### Summary of decisions

| Decision | Choice | Why |
|---|---|---|
| Code generation | Counter with range allocation + base62 | Unique without collision checks; scales far beyond our write rate |
| Redirect status | 302 | Keeps analytics and expiration control |
| Storage | Key-value store (or PostgreSQL) keyed by `short_code` | Pure key lookups; 3 TB is modest |
| Read path | Redis cache-aside, optional CDN | Skewed popularity, strict latency |
| Analytics | Async via Kafka to OLAP | Keep redirects fast and independent |
| Availability | Stateless services, multi-AZ replication, decoupled paths | 99.99% redirect availability |

Notice how almost every sentence used a concept from earlier parts: QPS estimation, base62 capacity, HTTP status codes, cache-aside, key-value vs relational trade-offs, ID generation, async messaging, rate limiting, graceful degradation, multi-AZ redundancy.

### 19.5 Classic Problems and the Concepts They Test

Use this table to connect the fundamentals to practice problems (all widely available on sites like Hello Interview, NeetCode, and in system design books):

| Problem | Key concepts |
|---|---|
| URL shortener | ID generation, base62, caching, key-value stores, 301 vs 302 |
| Rate limiter | Token bucket / sliding window, Redis atomic ops, distributed counters |
| News feed / Twitter | Fan-out on write vs read, celebrity problem, caching, sharding, Snowflake IDs |
| Chat app (WhatsApp, Slack) | WebSockets, connection registry, pub/sub, message ordering, wide-column storage, push notifications |
| Notification system | Queues, fan-out, retries, DLQs, idempotency, third-party providers (APNs, FCM, email, SMS) |
| Video platform (YouTube, Netflix) | Object storage, transcoding pipelines, adaptive bitrate (HLS/DASH), CDN |
| File storage/sync (Dropbox, Google Drive) | Chunking, deduplication by hash, presigned URLs, metadata DB, sync conflicts |
| Ride sharing (Uber) | Geospatial indexing (geohash, quadtree, H3), real-time location updates, matching, consistency for assignments |
| Nearby places (Yelp) | Geospatial queries, read-heavy caching, search |
| Ticket booking (Ticketmaster) | Contention, locking, TTL holds, virtual waiting room, consistency over availability |
| E-commerce / flash sale | Inventory consistency, queues, sagas, idempotent payments |
| Payment system | Idempotency keys, exactly-once processing, ledgers, event sourcing, reconciliation |
| Search autocomplete | Tries, top-K, precomputation, caching, debouncing |
| Web crawler | BFS at scale, URL frontier queues, politeness, Bloom filters, deduplication |
| Top-K / trending | Stream processing, windowing, Count-Min Sketch, heaps |
| Distributed cache / key-value store | Consistent hashing, replication, quorums, eviction, gossip |
| Collaborative editor (Google Docs) | WebSockets, operational transformation or CRDTs, versioning |
| Metrics / logging system | Time-series storage, high write throughput, downsampling, Kafka ingestion |
| Ad click aggregation | Stream processing, exactly-once semantics, OLAP stores, reconciliation |

---

## Part 20: Glossary

Every abbreviation and key term from this guide, alphabetically. Section numbers point to the full explanation.

| Term | Full form / meaning |
|---|---|
| **2PC** | Two-Phase Commit — distributed transaction protocol with prepare and commit phases (10.7) |
| **ABAC** | Attribute-Based Access Control (3.7) |
| **ABR** | Adaptive Bitrate streaming — player switches video quality based on bandwidth (15.2) |
| **ACID** | Atomicity, Consistency, Isolation, Durability — transaction guarantees (8.2) |
| **Active-active / active-passive** | All replicas serve traffic / one serves while a standby waits (13.2) |
| **Anycast** | One IP address announced from many locations; network routes to the nearest (6.4) |
| **API** | Application Programming Interface (Part 3) |
| **API gateway** | Single entry point handling auth, rate limiting, routing to services (6.5) |
| **AP / CP** | Systems favoring Availability / Consistency during network partitions (10.2) |
| **At-least-once / at-most-once / exactly-once** | Message delivery guarantees (10.8) |
| **AuthN / AuthZ** | Authentication (who you are) / Authorization (what you may do) (3.7) |
| **Availability** | Fraction of time a system serves requests successfully (4.3) |
| **AZ** | Availability Zone — isolated data center within a cloud region (18.1) |
| **Back-of-the-envelope** | Quick, rough capacity calculations (Part 5) |
| **Backpressure** | Signaling upstream to slow down when downstream can't keep up (11.5, 13.7) |
| **BASE** | Basically Available, Soft state, Eventual consistency (10.3) |
| **BFF** | Backend For Frontend — a gateway tailored to one client type (6.5) |
| **BLOB** | Binary Large Object — large unstructured file (8.11) |
| **Bloom filter** | Probabilistic set membership: no false negatives, some false positives (14.1) |
| **BOLA / IDOR** | Broken Object Level Authorization / Insecure Direct Object Reference (16.1) |
| **B-tree** | Balanced tree storage structure optimized for reads (8.13) |
| **Bulkhead** | Isolating resources so one failure can't exhaust everything (13.5) |
| **Cache-aside** | App reads cache, loads DB on miss, fills cache (7.3) |
| **CAP theorem** | Consistency, Availability, Partition tolerance — pick C or A during partitions (10.2) |
| **CCPA** | California Consumer Privacy Act (16.7) |
| **CDC** | Change Data Capture — streaming database changes as events (11.7) |
| **CDN** | Content Delivery Network — edge caches near users (6.6) |
| **CI/CD** | Continuous Integration / Continuous Delivery or Deployment (18.6) |
| **CIDR** | Classless Inter-Domain Routing — IP range notation like `10.0.0.0/16` (2.2) |
| **Circuit breaker** | Stops calling a failing dependency for a while (closed/open/half-open) (13.5) |
| **Clock skew** | Difference between clocks on different machines (10.6) |
| **CNAME** | Canonical Name — DNS alias record (2.5) |
| **Consensus** | Nodes agreeing on a value despite failures (Raft, Paxos) (10.5) |
| **Consistent hashing** | Hash ring so adding/removing nodes moves only ~1/N of keys (9.4) |
| **Count-Min Sketch** | Probabilistic frequency counter (14.2) |
| **CORS** | Cross-Origin Resource Sharing (16.6) |
| **CQRS** | Command Query Responsibility Segregation — separate read and write models (11.8) |
| **CRDT** | Conflict-free Replicated Data Type — auto-merging data structures (9.1) |
| **CSP** | Content Security Policy — header restricting what scripts can run (16.6) |
| **CSRF** | Cross-Site Request Forgery (16.6) |
| **DAG** | Directed Acyclic Graph — e.g., of processing tasks (15.2) |
| **DAU / MAU** | Daily / Monthly Active Users (5.3) |
| **DDD** | Domain-Driven Design; bounded contexts guide service boundaries (12.3) |
| **DDoS** | Distributed Denial of Service (16.6) |
| **Denormalization** | Duplicating data to speed up reads (8.2) |
| **DLQ** | Dead Letter Queue — holds messages that repeatedly failed (11.5) |
| **DNS** | Domain Name System — maps names to IP addresses (2.5) |
| **Durability** | Stored data is not lost (4.5) |
| **E2EE** | End-to-End Encryption (16.2) |
| **EDA** | Event-Driven Architecture (11.6) |
| **Elasticity** | Automatically scaling up and down with demand (4.6) |
| **Error budget** | Allowed unreliability: 1 − SLO (4.4) |
| **ETag** | HTTP header identifying a resource version for caching (2.7) |
| **ETL / ELT** | Extract, Transform, Load / Extract, Load, Transform — data pipelines (8.10) |
| **Event sourcing** | Storing the sequence of events as the source of truth (11.8) |
| **Eventual consistency** | Replicas converge over time if writes stop (10.3) |
| **FaaS** | Function as a Service — serverless functions (12.6) |
| **Fan-out on write / read** | Push posts to followers' feeds at write time / assemble at read time (15.1) |
| **Fencing token** | Increasing number that prevents stale lock holders from writing (10.5) |
| **Forward proxy** | Proxy acting on behalf of clients (6.3) |
| **GDPR** | General Data Protection Regulation (EU) (9.2, 16.7) |
| **Geohash** | String encoding of a location; shared prefix = nearby (14.4) |
| **Gossip protocol** | Peer-to-peer spreading of cluster state (10.10) |
| **gRPC** | High-performance RPC framework using Protobuf over HTTP/2 (3.3) |
| **GraphQL** | Query language where clients select exact fields (3.2) |
| **Graceful degradation** | Reduced functionality instead of total failure (13.7) |
| **HATEOAS** | Hypermedia As The Engine Of Application State (3.1) |
| **Health check (liveness/readiness)** | Is the process alive / ready for traffic (6.4) |
| **HLC** | Hybrid Logical Clock (10.6) |
| **HLD / LLD** | High-Level Design / Low-Level Design (1.1) |
| **HLS / DASH** | HTTP Live Streaming / Dynamic Adaptive Streaming over HTTP (15.2) |
| **HOL blocking** | Head-of-Line blocking — one stalled item delays those behind it (2.3) |
| **Horizontal / vertical scaling** | More machines / bigger machine (6.1) |
| **Hot key / hot partition** | One key or shard receiving disproportionate traffic (7.6, 9.2) |
| **HPA** | Horizontal Pod Autoscaler (Kubernetes) (18.4) |
| **HSTS** | HTTP Strict Transport Security (16.6) |
| **HTTP / HTTPS** | HyperText Transfer Protocol / HTTP over TLS (2.7) |
| **HyperLogLog** | Probabilistic distinct-count estimator (14.3) |
| **IaaS / PaaS / SaaS** | Infrastructure / Platform / Software as a Service (18.2) |
| **IaC** | Infrastructure as Code (18.6) |
| **Idempotency** | Repeating an operation has the same effect as doing it once (2.7, 10.8) |
| **Idempotency key** | Client-supplied unique key to deduplicate retries (3.6) |
| **Index (composite, covering)** | Structure speeding lookups; multi-column; contains all needed columns (8.14) |
| **Inverted index** | Map from term to documents containing it (14.6) |
| **IP** | Internet Protocol (2.2) |
| **Isolation levels** | Read Uncommitted, Read Committed, Repeatable Read, Serializable (8.3) |
| **JWT** | JSON Web Token (3.7) |
| **KMS** | Key Management Service (16.2) |
| **L4 / L7** | Transport layer (IP/port) / application layer (HTTP) (2.1, 6.4) |
| **Latency / throughput / bandwidth** | Time per request / requests per second / link capacity (4.1) |
| **Leader / follower** | Node accepting writes / nodes replicating from it (9.1) |
| **Linearizability** | Strongest consistency: behaves like a single copy (10.3) |
| **Little's Law** | Concurrency = throughput × latency (4.1) |
| **Load balancer** | Distributes traffic across instances (6.4) |
| **Load shedding** | Deliberately rejecting excess requests to protect the system (13.7) |
| **Long polling** | Server holds the request until data is available (2.9) |
| **LRU / LFU** | Least Recently / Least Frequently Used eviction (7.4) |
| **LSM tree** | Log-Structured Merge tree — write-optimized storage (8.13) |
| **LWW** | Last Write Wins conflict resolution (9.1) |
| **Materialized view** | Stored, precomputed query result (9.3) |
| **Merkle tree** | Tree of hashes for efficient dataset comparison (14.8) |
| **MFA / SSO** | Multi-Factor Authentication / Single Sign-On (16.1) |
| **Microservices** | Independently deployable services owning their data (12.3) |
| **mTLS** | Mutual TLS — both sides present certificates (2.6) |
| **MTBF / MTTR** | Mean Time Between Failures / Mean Time To Recovery (4.3) |
| **Multi-leader / leaderless** | Several nodes / any node accept writes (9.1) |
| **MVCC** | Multi-Version Concurrency Control (8.3) |
| **N+1 problem** | One query plus one extra query per item (3.1, 3.2) |
| **NAT** | Network Address Translation (2.2) |
| **Normalization (1NF, 2NF, 3NF)** | Organizing tables so each fact is stored once (8.2) |
| **NoSQL** | "Not only SQL" — non-relational databases (8.1) |
| **NTP** | Network Time Protocol (10.6) |
| **OAuth 2.0 / OIDC** | Delegated authorization framework / OpenID Connect identity layer (3.7) |
| **Object storage** | Storage for files as objects in buckets (S3) (8.11) |
| **OCC** | Optimistic Concurrency Control (8.3) |
| **OLTP / OLAP** | Online Transaction Processing / Online Analytical Processing (8.10) |
| **OSI model** | Open Systems Interconnection 7-layer network model (2.1) |
| **OTel** | OpenTelemetry (17.1) |
| **Outbox pattern** | Write event to an outbox table in the same transaction, relay later (11.7) |
| **p50 / p95 / p99** | Latency percentiles (4.2) |
| **PACELC** | Partition: Availability or Consistency; Else: Latency or Consistency (10.2) |
| **Partition (network)** | Network failure splitting nodes into groups that can't communicate (10.2) |
| **Partition key / shard key** | Field deciding which partition stores a record (9.2) |
| **PCI DSS** | Payment Card Industry Data Security Standard (16.7) |
| **PII** | Personally Identifiable Information (16.7) |
| **PKCE** | Proof Key for Code Exchange — OAuth flow protection (3.7) |
| **PoP** | Point of Presence — CDN edge location (6.6) |
| **Presigned URL** | Temporary signed URL granting limited storage access (15.3) |
| **Protobuf** | Protocol Buffers — binary serialization format (3.3) |
| **Pub/Sub** | Publish/Subscribe messaging (11.3) |
| **QPS / RPS / TPS** | Queries / Requests / Transactions Per Second (4.1) |
| **Quadtree** | Recursive 2D space partitioning (14.4) |
| **QUIC** | UDP-based transport under HTTP/3 (2.8) |
| **Quorum (N, R, W)** | Replica counts for reads and writes; R + W > N ensures overlap (10.4) |
| **Raft / Paxos / ZAB** | Consensus algorithms (10.5) |
| **Rate limiting** | Capping requests per client per time window (13.6) |
| **RBAC / ReBAC** | Role-Based / Relationship-Based Access Control (3.7) |
| **RDBMS** | Relational Database Management System (8.2) |
| **Read replica** | Follower that serves reads (9.1) |
| **Read-your-writes** | A user always sees their own updates (10.3) |
| **REST** | Representational State Transfer (3.1) |
| **Reverse proxy** | Proxy acting on behalf of servers (6.3) |
| **RPC** | Remote Procedure Call (3.3) |
| **RPO / RTO** | Recovery Point Objective (data loss) / Recovery Time Objective (downtime) (4.5) |
| **RTT** | Round-Trip Time (2.3) |
| **RUM** | Real User Monitoring (17.3) |
| **Saga** | Sequence of local transactions with compensating actions (10.7) |
| **Sharding** | Horizontal partitioning of data across nodes (9.2) |
| **Sidecar / service mesh** | Proxy next to each service handling networking concerns (12.5) |
| **SLI / SLO / SLA** | Service Level Indicator / Objective / Agreement (4.4) |
| **Snowflake ID** | 64-bit time-sortable distributed ID (10.9) |
| **SPOF** | Single Point Of Failure (6.4, 13.1) |
| **Split-brain** | Two nodes both acting as leader (9.1) |
| **SQL** | Structured Query Language (8.2) |
| **SRE** | Site Reliability Engineering (4.4) |
| **SSE** | Server-Sent Events (2.9) |
| **SSRF** | Server-Side Request Forgery (16.6) |
| **SSTable** | Sorted String Table — immutable file in LSM storage (8.13) |
| **Stateless / stateful** | Keeps no per-client state locally / keeps state that later requests depend on (6.2) |
| **Sticky session** | Load balancer routes a client to the same server (6.4) |
| **Strangler Fig** | Gradual migration away from a monolith (12.7) |
| **STUN / TURN** | NAT traversal helpers for WebRTC (2.9) |
| **TCP / UDP** | Transmission Control Protocol / User Datagram Protocol (2.3, 2.4) |
| **Thundering herd / cache stampede** | Many clients hitting a resource at once (7.6, 13.4) |
| **TLD** | Top-Level Domain (2.5) |
| **TLS / SSL** | Transport Layer Security / Secure Sockets Layer (older) (2.6) |
| **Token bucket / leaky bucket** | Rate limiting algorithms (13.6) |
| **Trie** | Prefix tree, used for autocomplete (14.5) |
| **TTL** | Time To Live — expiry duration for caches and DNS (2.5, 7.5) |
| **UUID** | Universally Unique Identifier, 128 bits (v4 random, v7 time-ordered) (10.9) |
| **Vector clock** | Per-node counters detecting concurrent updates (10.6) |
| **Virtual nodes** | Multiple ring positions per server in consistent hashing (9.4) |
| **VPC** | Virtual Private Cloud (2.2, 16.5) |
| **WAF** | Web Application Firewall (6.3, 16.5) |
| **WAL** | Write-Ahead Log (8.2) |
| **WebRTC** | Web Real-Time Communication — peer-to-peer media (2.9) |
| **WebSocket** | Persistent full-duplex connection over TCP (2.9) |
| **Webhook** | Server-to-server HTTP callback on events (2.9) |
| **Write-through / write-behind / write-around** | Cache write strategies (7.3) |
| **XSS** | Cross-Site Scripting (16.6) |

---

## Final Words

You now have the vocabulary and mental models behind high-level system design:

- **How requests travel** (DNS, TCP, TLS, HTTP versions, real-time protocols).
- **How components talk** (REST, GraphQL, gRPC, queues, streams).
- **How to size a system** (QPS, storage, bandwidth, cache, servers).
- **How to scale it** (stateless services, load balancers, caches, CDNs, replication, sharding).
- **How to store data** (the right database for each access pattern).
- **How distributed systems behave** (CAP, consistency, quorums, consensus, idempotency).
- **How to keep it running** (redundancy, timeouts, retries, circuit breakers, rate limits, observability).

**Next steps for practice:**

1. Re-read each part's key takeaways and explain them out loud without looking.
2. Pick a problem from Section 19.5, and before designing, list which concepts it will need.
3. Practice the framework in Section 19.2 against a timer (45 minutes), ideally with someone playing interviewer.
4. After each practice design, check: Did I state quantified non-functional requirements? Did I justify every database? Did I name trade-offs? Did I find the SPOFs?
