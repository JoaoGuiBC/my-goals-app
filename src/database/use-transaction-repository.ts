import { useCallback } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next'

export interface CreateTransaction {
  amount: number
  goalId: number
}

export interface GetTransaction {
  id: string
  amount: number
  goal_id: number
  created_at: number
}

export function useTransactionRepository() {
  const database = useSQLiteContext()

  const findLatest = useCallback(() => {
    return database.getAllSync<GetTransaction>(
      'SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10',
    )
  }, [database])

  const findByGoal = useCallback(
    (goalId: number) => {
      const statement = database.prepareSync(
        'SELECT * FROM transactions WHERE goal_id = $goal_id',
      )

      const result = statement.executeSync<GetTransaction>({
        $goal_id: goalId,
      })

      return result.getAllSync()
    },
    [database],
  )

  function create(transaction: CreateTransaction) {
    const statement = database.prepareSync(
      'INSERT INTO transactions (amount, goal_id) VALUES ($amount, $goal_id)',
    )

    statement.executeSync({
      $amount: transaction.amount,
      $goal_id: transaction.goalId,
    })
  }

  return {
    create,
    findByGoal,
    findLatest,
  }
}
