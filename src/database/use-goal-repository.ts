import { useSQLiteContext } from 'expo-sqlite/next'

export interface GetGoals {
  id: string
  name: string
  total: number
  current: number
}

export interface CreateGoal {
  name: string
  total: number
}

export function useGoalRepository() {
  const database = useSQLiteContext()

  function get(id: number) {
    const statement = database.prepareSync(`
      SELECT g.id, g.name, g.total, COALESCE(SUM(t.amount), 0) AS current
      FROM goals AS g
      LEFT JOIN transactions t ON t.goal_id = g.id
      WHERE g.id = $id
      GROUP BY g.id, g.name, g.total
    `)

    const result = statement.executeSync<GetGoals>({ $id: id })

    return result.getFirstSync()
  }

  function list() {
    console.log('bunda')
    return database.getAllSync<GetGoals>(`
      SELECT g.id, g.name, g.total, COALESCE(SUM(t.amount), 0) AS current
      FROM goals AS g
      LEFT JOIN transactions t ON t.goal_id = g.id
      GROUP BY g.id, g.name, g.total
    `)
  }

  function create(goal: CreateGoal) {
    const statement = database.prepareSync(
      'INSERT INTO goals (name, total) VALUES ($name, $total)',
    )

    statement.executeSync({
      $name: goal.name,
      $total: goal.total,
    })
  }

  return {
    get,
    list,
    create,
  }
}
