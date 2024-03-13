// LIBS
import dayjs from 'dayjs'
import Bottom from '@gorhom/bottom-sheet'
import { Alert, Keyboard, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'

// DATABASE
import { useGoalRepository } from '@/database/use-goal-repository'
import { useTransactionRepository } from '@/database/use-transaction-repository'

// COMPONENTS
import { Input } from '@/components/input'
import { Header } from '@/components/header'
import { Button } from '@/components/button'
import { Loading } from '@/components/loading'
import { Progress } from '@/components/progress'
import { BackButton } from '@/components/back-button'
import { BottomSheet } from '@/components/bottom-sheet'
import { Transactions } from '@/components/transactions'
import { TransactionData } from '@/components/transaction'
import { TransactionTypeSelect } from '@/components/transaction-type-select'

// UTILS
import { mocks } from '@/utils/mocks'
import { currencyFormat } from '@/utils/currency-format'

type Details = {
  name: string
  total: string
  current: string
  percentage: number
  transactions: TransactionData[]
}

export default function Details() {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [type, setType] = useState<'up' | 'down'>('up')
  const [goal, setGoal] = useState<Details>({} as Details)

  // PARAMS
  const routeParams = useLocalSearchParams()
  const goalId = Number(routeParams.id)

  // DATABASE
  const goalRepository = useGoalRepository()
  const transactionRepository = useTransactionRepository()

  // BOTTOM SHEET
  const bottomSheetRef = useRef<Bottom>(null)
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand()
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0)

  const getDetails = useCallback(() => {
    try {
      if (goalId) {
        const goal = goalRepository.get(goalId)
        const transactions = mocks.transactions

        if (!goal || !transactions) {
          return router.back()
        }

        setGoal({
          name: goal.name,
          current: currencyFormat(goal.current),
          total: currencyFormat(goal.total),
          percentage: (goal.current / goal.total) * 100,
          transactions: transactions.map((item) => ({
            ...item,
            date: dayjs(item.created_at).format('DD/MM/YYYY [às] HH:mm'),
          })),
        })

        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }, [goalId, goalRepository])

  async function handleNewTransaction() {
    try {
      let amountAsNumber = Number(amount.replace(',', '.'))

      if (isNaN(amountAsNumber)) {
        return Alert.alert('Erro', 'Valor inválido.')
      }

      if (type === 'down') {
        amountAsNumber = amountAsNumber * -1
      }

      transactionRepository.create({ goalId, amount: amountAsNumber })

      Alert.alert('Sucesso', 'Transação registrada!')

      handleBottomSheetClose()
      Keyboard.dismiss()

      setAmount('')
      setType('up')

      getDetails()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDetails()
  }, [getDetails])

  if (isLoading) {
    return <Loading />
  }

  return (
    <View className="flex-1 p-8 pt-12">
      <BackButton />

      <Header title={goal.name} subtitle={`${goal.current} de ${goal.total}`} />

      <Progress percentage={goal.percentage} />

      <Transactions transactions={goal.transactions} />

      <Button title="Nova transação" onPress={handleBottomSheetOpen} />

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova transação"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <TransactionTypeSelect onChange={setType} selected={type} />

        <Input
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setAmount}
          value={amount}
        />

        <Button title="Confirmar" onPress={handleNewTransaction} />
      </BottomSheet>
    </View>
  )
}
