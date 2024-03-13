// LIBS
import { Pressable, PressableProps, Text } from 'react-native'

// UTILS
import { currencyFormat } from '@/utils/currency-format'

// STYLES
import { colors } from '@/styles/colors'

export type TransactionData = {
  date: string
  amount: number
}

type TransactionProps = PressableProps & {
  transaction: TransactionData
}

export function Transaction({ transaction, ...rest }: TransactionProps) {
  return (
    <Pressable
      className="w-full h-16 bg-gray-500 rounded-sm border border-gray-400 p-4 flex-row items-center justify-between"
      {...rest}
    >
      <Text
        className="font-regular text-sm"
        style={{
          color: transaction.amount < 0 ? colors.red[500] : colors.green[500],
        }}
      >
        {transaction.amount < 0 ? '- ' : '+ '}
        {currencyFormat(transaction.amount).replace('-', '')}
      </Text>

      <Text className="text-gray-300 font-regular text-sm">
        {transaction.date}
      </Text>
    </Pressable>
  )
}
