import { useEffect, useRef, useState } from 'react'
//styles
import './App.css';
//components
import Navbar from './components/Navbar/Navbar'
import AppHead from './components/AppHead/AppHead'
import AppBody from './components/AppBody/AppBody';
//contexts
import { TransactionsContext, MoneyContext } from "./Contexts/AllContexts"
//variables
import { dummyData } from './dummyTransactions';

function App() {
  const [money, setMoney] = useState({
    balance: 5000,
    expenses: 5000
  });
  const [transactionData, setTransactionData] = useState(dummyData);
  const initialRender = useRef(true);

  // load once
  useEffect(() => {
    if (initialRender.current) {
      onLoad();
      initialRender.current = false;
    }
  }, []);

  // save whenever state changes
  useEffect(() => {
    if (!initialRender.current) {
      localStorage.setItem(
        "allData",
        JSON.stringify({ money, transactionData })
      );
       localStorage.setItem(
        "expenses",
        JSON.stringify(transactionData)
      );
    }
  }, [money, transactionData]);

  // functions
  const onLoad = () => {
    try {
      const localData = localStorage.getItem("allData");
      if (localData) {
        const parsed = JSON.parse(localData);

        // fallback if keys are missing
        setMoney(parsed.money ?? { balance: 5000, expenses: 0 });
        setTransactionData(parsed.transactionData ?? []);
      } else {
        // initialize storage the first time
         console.log(money);
        console.log(transactionData);
        localStorage.setItem(
          "allData",
          JSON.stringify({ money, transactionData })
        );
       
         localStorage.setItem(
          "expenses",
           JSON.stringify(transactionData)
        );
        console.log( JSON.stringify({ "money" : money, "transactionData" : transactionData }));
      }
    } catch (err) {
      console.error("Error loading data from localStorage", err);
    }
  };

  return (
    <main className="App">
      <MoneyContext.Provider value={[money, setMoney]}>
        <TransactionsContext.Provider value={[transactionData, setTransactionData]}>
          <Navbar />
          <AppHead balance={money.balance} expenses={money.expenses} />
          <AppBody transactionData={transactionData} />
        </TransactionsContext.Provider>
      </MoneyContext.Provider>
    </main>
  );
}

export default App;
