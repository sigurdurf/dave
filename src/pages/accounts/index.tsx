import type { NextPage } from "next";
import type { SavingsAccount } from "@prisma/client";
import { api } from "~/utils/api";
import styles from "./index.module.css";

const Accounts: NextPage = () => {

    return (
      <>
      <AccountSummary/>
      <div className={styles.container}>
        <AddAccount />
        <AddTransaction />
      </div>
      </>
    )
}
export default Accounts;

interface BalanceProps {
  AccountId: string
}

const Balance = (props: BalanceProps) => {
  const { data: balance } = api.dave.getSavingsAccountSum.useQuery(props.AccountId)
  return <span>{balance}</span>
}

const AccountSummary: React.FC = () => {
  const { data: myAccounts } = api.dave.getAllSavingsAccount.useQuery()
  const { data: total } = api.dave.getTotalsSavingsSum.useQuery()
  return (
    <>
    <p>Total savings<br /><span>${total}</span></p>
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
            <td><Balance AccountId={account.id} /></td>

          </tr>
        ))}
          </tbody>
        </table>
    </>
  )
}

const AddAccount: React.FC = () => {
  const ctx = api.useContext()
  const { mutate, error } = api.dave.createSavingsAccount.useMutation({
    onSuccess: () => {
      void ctx.dave.getAllSavingsAccount.invalidate();
    }
  });
  return (
          <div className={styles.flexOuter}>
          <p>Add account</p>
          <form id="addAccountForm" onSubmit={(e) => {

            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const newName = formData.get('name');
            const newLocation = formData.get('location');
            const newType = formData.get('type');
            if (!newName || !newLocation || !newType){
              return
            }
            mutate({ 
              name: newName.toString(),
              location: newLocation.toString(),
              type: newType.toString()
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
        
  )
}

const AddTransaction: React.FC = () => {
  const ctx = api.useContext()
  const { mutate, error } = api.dave.createTransaction.useMutation({
    onSuccess: () => {
      void ctx.dave.getSavingsAccountSum.invalidate();
      void ctx.dave.getTotalsSavingsSum.invalidate();
    }
  });
  const { data: myAccounts } = api.dave.getAllSavingsAccount.useQuery();

  return (
    <div className={styles.flexOuter}>
          <p>Add transaction</p>
          <form id="addTransactionForm" onSubmit={(e) => {

            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const newAmount = formData.get('amount');
            const newAccountId = formData.get('accountId');
            if (newAmount === null || newAccountId === null){
              return
            }
            mutate({ 
              amount: parseInt(newAmount.toString()),
              accountId: newAccountId.toString()

            })
            e.currentTarget.reset()
            // TODO: refresh account data 
          }}>
            <ul className={styles.flexOuter}>
            <li>
              <input name="amount" type="text" placeholder="Amount" />
              {error?.data?.zodError?.fieldErrors.amount && (
                <span className={styles.error}>{error.data.zodError.fieldErrors.amount}</span>
              )}
            </li>
            <li>
              <select name="accountId" id="">
                {myAccounts?.map((account) => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
              {error?.data?.zodError?.fieldErrors.account && (
                <span className={styles.error}>{error.data.zodError.fieldErrors.account}</span>
              )}
            </li>
            <li>
            <button type="submit">Add new account</button>
            </li>
            </ul>
          </form>
          </div>
  )
}