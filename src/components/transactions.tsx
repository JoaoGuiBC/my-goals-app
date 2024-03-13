// LIBS
import { FlatList, Text, View } from 'react-native'

// COMPONENTS
import { Transaction, TransactionData } from '@/components/transaction'

export type TransactionsData = TransactionData[]

type TransactionsProps = {
  transactions: TransactionsData
}

export function Transactions({ transactions }: TransactionsProps) {
  return (
    <View className="flex-1 mt-10">
      <Text className="text-white font-semiBold text-base border-b border-b-gray-400 pb-3">
        Últimas transações
      </Text>

      <FlatList
        data={transactions}
        renderItem={({ item }) => <Transaction transaction={item} />}
        contentContainerClassName="py-6 gap-4"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text className="text-gray-300 font-regular text-sm">
            Nenhuma transação registrada ainda.
          </Text>
        )}
      />
    </View>
  )
}
