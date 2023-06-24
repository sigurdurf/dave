import { Expense } from "@prisma/client";
import type { NextPage } from "next";
import { api } from "~/utils/api"

interface ExpenseProps {
  expenseId: string
}

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
        <li key={expense.id}>{expense.title} : {expense.amount} - <RemoveExpense expenseId={expense.id} /></li>
      ))}
    </ul>
  )
}

const RemoveExpense = (props: ExpenseProps) => {
  const ctx = api.useContext();
  const {mutate, error } = api.expenses.removeExpense.useMutation({
    onSuccess: () => {
      void ctx.expenses.getAllExpenses.invalidate();
    }
  })

  const removeExpense = () => {
    mutate(props.expenseId)
  }

  return (
    <>
      <button onClick={removeExpense}>Remove</button>
    </>
  )
}