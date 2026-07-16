import React from 'react'
import { Text } from 'react-native'
import {colors, radius, spacing} from "../theme/theme"

export const STATUS_META ={
  pending : {label : "Pending", color : colors.warning, background : colors.warningLight},
  confirmed : {label :"Confirmed", color : colors.info, background : colors.infoLight},
  dispatched : {
    label : "Dispatched", color: colors.primary, background : colors.primaryLight
  },
  delivered : {
    label : "Delivered", color: colors.success, background : colors.successLight
  },
  cancelled : {
    label : "Cancelled", color : colors.danger, background : colors.danger + "1A"
  }
} 

function StatusPills() {
  return (
    <Text>StatusPills</Text>
  )
}

export default StatusPills