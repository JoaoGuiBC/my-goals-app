// LIBS
import dayjs from 'dayjs'
import { router } from 'expo-router'
import Bottom from '@gorhom/bottom-sheet'
import { useEffect, useRef, useState } from 'react'
import { Alert, View, Keyboard } from 'react-native'

// DATABASE
import { useGoalRepository } from '@/database/use-goal-repository'
import { useTransactionRepository } from '@/database/use-transaction-repository'

// COMPONENTS
import { Input } from '@/components/input'
import { Header } from '@/components/header'
import { Button } from '@/components/button'
import { Goals, GoalData } from '@/components/goals'
import { BottomSheet } from '@/components/bottom-sheet'
import { Transactions, TransactionsData } from '@/components/transactions'

export default function Home() {
  // LISTS
  const [goals, setGoals] = useState<GoalData[]>([])
  const [transactions, setTransactions] = useState<TransactionsData>([])

  // FORM
  const [name, setName] = useState('')
  const [total, setTotal] = useState('')

  // DATABASE
  const goalRepository = useGoalRepository()
  const transactionRepository = useTransactionRepository()

  // BOTTOM SHEET
  const bottomSheetRef = useRef<Bottom>(null)
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand()
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0)

  function handleDetails(id: string) {
    router.navigate(`/details/${id}`)
  }

  async function handleCreateGoal() {
    try {
      const totalAsNumber = Number(total.toString().replace(',', '.'))

      if (isNaN(totalAsNumber)) {
        return Alert.alert('Erro', 'Valor inválido.')
      }

      goalRepository.create({ name, total: totalAsNumber })

      Keyboard.dismiss()
      handleBottomSheetClose()
      Alert.alert('Sucesso', 'Meta cadastrada!')

      setName('')
      setTotal('')

      listGoals()
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar.')
      console.log(error)
    }
  }

  async function listGoals() {
    try {
      const response = goalRepository.list()
      setGoals(response)
    } catch (error) {
      console.log(error)
    }
  }

  async function listTransactions() {
    try {
      const response = transactionRepository.findLatest()

      setTransactions(
        response.map((item) => ({
          ...item,
          date: dayjs(item.created_at).format('DD/MM/YYYY [às] HH:mm'),
        })),
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    listGoals()
    listTransactions()
  }, [])

  return (
    <View className="flex-1 p-8">
      <Header
        title="Suas metas"
        subtitle="Poupe hoje para colher os frutos amanhã."
      />

      <Goals
        goals={goals}
        onAdd={handleBottomSheetOpen}
        onPress={handleDetails}
      />

      <Transactions transactions={transactions} />

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova meta"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <Input placeholder="Nome da meta" onChangeText={setName} value={name} />

        <Input
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
        />

        <Button title="Criar" onPress={handleCreateGoal} />
      </BottomSheet>
    </View>
  )
}
