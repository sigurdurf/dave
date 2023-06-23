import { Expense } from "@prisma/client";
import type { NextPage } from "next";
import { api } from "~/utils/api"

const Accounts: NextPage = () => {
    return (
      <>
        My expenses page
        <AddExpense />
        <ExpensesList />
      </>
    )
}
export default Accounts;

const AddExpense: React.FC = () => {
  const ctx = api.useContext();
  const { mutate, error } = api.expenses.createExpense.useMutation({
    onSuccess: () => {
      void ctx.expenses.getAllExpenses.invalidate();
    }
  })
  const addTestExpense = () => {
    mutate({
      amount: 1000,
      title: "bills"
    })
  }
  return (
    <>
      <button onClick={addTestExpense}>Add bill</button>
    </>
  )
}

const ExpensesList = () => {
  const { data: expenses } = api.expenses.getAllExpenses.useQuery();
  return (
    <ul>
      {expenses?.map( (expense: Expense) => (
        <li key={expense.id}>{expense.title} : {expense.amount}</li>
      ))}
    </ul>
  )
}