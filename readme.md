two°
====

Climate change is one of the critical challenges of the 21st century. At the Paris climate conference (COP21) in November-December 2015, 195 countries adopted the first-ever universal, legally binding global climate deal. In order to transform the way we treat our environment and our planet, citizen engagement in climate change initiatives is very important.

two° tries to address this global challenge and bring disruptive innovation to the area of tackling climate change with a citizen engagement platform for climate change, leverages Internet of Things (IoT), Blockchain and Gamification.

two° utilizes the capabilities of IoT and uses sensors to collect data on consumption of resources by citizens who sign-up for individual climate change goals to help achieve their country’s commitment at the Paris accord. Blockchain tracks the actual usage and achievement of goals in a secure, distributed and highly-scalable manner, using the concept of smart contracts. Gamification rewards the citizens for achieving goals with virtual currency.

Competing with 33 teams from 8 different locations globally, two° won the top spot as well as the 'Most Innovative Solution' award at Semicolons 2016.

running two°
------------
two° has several components:
- Ethereum, a distributed blockchain which stores all the data and handles the smart contracts
- Raspberry Pi connected to a smart sensor. Ideally, two° will hook on to smart meters (electricity grid, cars, etc.) to measure daily usage and push it as transactions to blockchain.
- A companion app to monitor usage and to set goals
- A web dash for getting detailed statistics and records

```
├── build/
├── dash/           Web dashboard
├── data/           Scripts to generate mock data
├── ethereum/       Ethereum stuff: API wrappers, genesis block, wallet, etc.
├── mobile/         Ionic mobile app
├── mock/           API to provide mock users to web dashboard
├── stats/          A sleek dashboard to display blockchain network statistics
├── usage/          Scripts that took usage readings on Raspberry Pi
└── webtail/        Webtail for ethereum logs
```
