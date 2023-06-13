import type { NextPage } from "next";
import type { SavingsAccount } from "@prisma/client";
import { api } from "~/utils/api";
import styles from "./index.module.css";


const Accounts: NextPage = () => {

    return (
        <>
            <AccountList />
        </>
    )
}
export default Accounts;

const AccountList: React.FC = () => {
    
    const { data: myAccounts } = api.dave.getAllSavingsAccount.useQuery();
    
    const someAmount = 800.00;
    const totalSavings = someAmount * (myAccounts ? myAccounts.length : 0);
    return (
      <>
        <p>Total savings<br /><span>${totalSavings}</span></p>
        <p>Accounts</p>
        <table className={styles.table}>
          <thead><td>Name</td><td>Location</td><td>Type</td><td>Amount</td></thead>
        { myAccounts?.map( (account: SavingsAccount) => (
          <tr className={styles.savingAccountEntry} key={account.id}>
            <td>{account?.name}</td>
            <td>{account?.location}</td>
            <td>{account?.type ? account.type : "Some type"}</td>
            <td>{someAmount}</td>
          </tr>
        ))}
        </table>
        <>
          <p>Add account</p>
          <form action="">
            <input name="name" type="text" placeholder="Account name"/>
            <input name="location" type="text" placeholder="Account location" />
            <select name="type" id="">
              <option>Bound</option>
              <option>Unbound</option>
              <option>Bonds</option>
            </select>
            <button>Add new account</button>
          </form>
        </>
      </>
    )
  }