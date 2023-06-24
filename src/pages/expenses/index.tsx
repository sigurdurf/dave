import type { Expense } from "@prisma/client";
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
  return (
    <>
      <form id="addExpenseForm" onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const newAmount = formData.get('amount');
        const newTitle = formData.get('title');
        const newTags = formData.get('tags');

        if (!newAmount || !newTitle) {
          return
        }
        if (!newTags){
          mutate({
            amount: parseInt(newAmount.toString()),
            title: newTitle.toString()
          })
        } else {
          mutate({
            amount: parseInt(newAmount.toString()),
            title: newTitle.toString(),
            //tags: newTags
          })
        }

        e.currentTarget.reset();

      }}>
        <ul className="">
          <li>
            <input name="amount" type="text" placeholder="amount" />
            {error?.data?.zodError?.fieldErrors.amount && (
              <span className="">{error.data.zodError.fieldErrors.amount}</span>
            )}
          </li>
          <li>
            <input name="title" type="text" placeholder="Title" />
            {error?.data?.zodError?.fieldErrors.amount && (
              <span className="">{error.data.zodError.fieldErrors.title}</span>
            )}
          </li>
        </ul>
        <button type="submit">Add bill</button>
      </form>
    </>
  )
}

const ExpensesList = () => {
  const { data: expenses } = api.expenses.getAllExpenses.useQuery();
  const total = expenses?.reduce( (a: number, b: Expense) => {
    return a + b.amount;
  }, 0)
  return (
    <>
    <ul>
      {expenses?.map( (expense: Expense) => (
        <li key={expense.id}>{expense.title} : {expense.amount} - <RemoveExpense expenseId={expense.id} /></li>
      ))}
    </ul>
    <p>Total expenses {total}</p>
    </>
  )
}

const RemoveExpense = (props: ExpenseProps) => {
  const ctx = api.useContext();
  const { mutate } = api.expenses.removeExpense.useMutation({
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