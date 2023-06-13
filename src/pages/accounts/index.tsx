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
    const ctx = api.useContext()

    const { mutate, error } = api.dave.createSavingsAccount.useMutation({
      onSuccess: () => {
        void ctx.dave.getAllSavingsAccount.invalidate();
      }
    });
    const someAmount = 800.00;
    const totalSavings = someAmount * (myAccounts ? myAccounts.length : 0);
    
    return (
      <>
        <p>Total savings<br /><span>${totalSavings}</span></p>
        <p>Accounts</p>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Name</td><td>Location</td><td>Type</td><td>Amount</td>
            </tr>
          </thead>
          <tbody>
        { myAccounts?.map( (account: SavingsAccount) => (
          <tr className={styles.savingAccountEntry} key={account.id}>
            <td>{account?.name}</td>
            <td>{account?.location}</td>
            <td>{account?.type !== undefined ? account.type : "Some type"}</td>
            <td>{someAmount}</td>
          </tr>
        ))}
          </tbody>
        </table>
        <div className={styles.container}>
          <div className={styles.flexOuter}>
          <p>Add account</p>
          <form id="addAccountForm" onSubmit={(e) => {

            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            mutate({ 
              name: formData.get('name'),
              location: formData.get('location'),
              type: formData.get('type')
            })
            e.currentTarget.reset()
            // TODO: refresh account data 
          }}>
            <ul className={styles.flexOuter}>
              <li>
                <input name="name" type="text" placeholder="Account name" />
                  {error?.data?.zodError?.fieldErrors.name && (
                    <span className={styles.error}>{error.data.zodError.fieldErrors.name}</span>
                  )}
              </li>
            <li>
              <input name="location" type="text" placeholder="Account location" />
              {error?.data?.zodError?.fieldErrors.location && (
                <span className={styles.error}>{error.data.zodError.fieldErrors.location}</span>
              )}
            </li>
            <li>
              <select name="type" id="">
                <option value="BOUND">Bound</option>
                <option value="UNBOUND">Unbound</option>
                <option value="BONDS">Bonds</option>
                <option value="CASH">Cash</option>
              </select>
              {error?.data?.zodError?.fieldErrors.type && (
                <span className={styles.error}>{error.data.zodError.fieldErrors.type}</span>
              )}
            </li>
            <li>
            <button type="submit">Add new account</button>
            </li>
            </ul>
          </form>
          </div>

          <div className={styles.flexOuter}>
          <p>Add transaction</p>
          <form id="addAccountForm" onSubmit={(e) => {

            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            mutate({ 
              name: formData.get('name'),
              location: formData.get('location'),
              type: formData.get('type')
            })
            e.currentTarget.reset()
            // TODO: refresh account data 
          }}>
            <ul className={styles.flexOuter}>
              <li>
                <input name="name" type="text" placeholder="Account name" />
                  {error?.data?.zodError?.fieldErrors.name && (
                    <span className={styles.error}>{error.data.zodError.fieldErrors.name}</span>
                  )}
              </li>
            <li>
              <input name="location" type="text" placeholder="Account location" />
              {error?.data?.zodError?.fieldErrors.location && (
                <span className={styles.error}>{error.data.zodError.fieldErrors.location}</span>
              )}
            </li>
            <li>
              <select name="type" id="">
                <option value="BOUND">Bound</option>
                <option value="UNBOUND">Unbound</option>
                <option value="BONDS">Bonds</option>
                <option value="CASH">Cash</option>
              </select>
              {error?.data?.zodError?.fieldErrors.type && (
                <span className={styles.error}>{error.data.zodError.fieldErrors.type}</span>
              )}
            </li>
            <li>
            <button type="submit">Add new account</button>
            </li>
            </ul>
          </form>
          </div>
        </div>
      </>
    )
  }