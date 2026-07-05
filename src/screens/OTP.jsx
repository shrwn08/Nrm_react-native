import React, { useRef, useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'

// One self-contained block: label, 6-digit boxes, resend row, and a
// "verified" checkmark state. Used twice below — once for phone, once
// for email — so the two channels don't share timers or OTP state.
function OtpBlock({ title, target, onVerified }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [verified, setVerified] = useState(false)
  const [timer, setTimer] = useState(30)
  const inputRefs = useRef([])

  useEffect(() => {
    if (timer === 0 || verified) return
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer, verified])

  const handleChange = (text, index) => {
    const digit = text.slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    if (digit && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = () => {
    const code = otp.join('')
    if (code.length < 6) {
      alert(`Please enter the complete 6-digit code sent to your ${title.toLowerCase()}`)
      return
    }

    // replace with your actual verify-OTP API call for this specific channel
    console.log('Verifying', title, 'OTP:', code, 'for', target)

    // Assume success for now — swap this for your API response check
    setVerified(true)
    onVerified(true)
  }

  const handleResend = () => {
    if (timer > 0) return

    // replace with your actual resend-OTP API call
    console.log('Resending OTP to', title, target)

    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    setTimer(30)
  }

  if (verified) {
    return (
      <View style={styles.blockContainer}>
        <View style={styles.verifiedRow}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <View>
            <Text style={styles.fieldLabel}>{title}</Text>
            <Text style={styles.verifiedText}>{target} — Verified</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.blockContainer}>
      <Text style={styles.fieldLabel}>{title}</Text>
      <Text style={styles.targetText}>Code sent to {target}</Text>

      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpBox}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
          <Text style={[styles.resendLink, timer > 0 && styles.resendDisabled]}>
            {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify {title}</Text>
      </TouchableOpacity>
    </View>
  )
}

function OTP() {

  const route = useRoute()
  const navigation = useNavigation()

  const email = route.params?.email || ''
  const phoneNo = route.params?.phone_no || ''

  const [phoneVerified, setPhoneVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  const bothVerified =
    (!phoneNo || phoneVerified) && (!email || emailVerified) && (phoneNo || email)

  const handleContinue = () => {
    if (!bothVerified) return
    // Both channels confirmed — safe to move on, e.g. finish registration
    // or navigate to the main app
    console.log('Both channels verified, continuing...')
    navigation.navigate('Login')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Verify Your Details</Text>
      <Text style={styles.subtext}>
        We've sent separate codes to your phone and email
      </Text>

      {phoneNo ? (
        <OtpBlock
          title="Phone Number"
          target={phoneNo}
          onVerified={setPhoneVerified}
        />
      ) : null}

      {email ? (
        <OtpBlock
          title="Email"
          target={email}
          onVerified={setEmailVerified}
        />
      ) : null}

      <TouchableOpacity
        style={[styles.submitButton, !bothVerified && styles.submitButtonDisabled]}
        onPress={handleContinue}
        disabled={!bothVerified}
      >
        <Text style={styles.submitText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  blockContainer: {
    borderWidth: 1,
    borderColor: '#DADDE2',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: 15,
    color: '#1E1E1E',
    fontWeight: '600',
    marginBottom: 4,
  },
  targetText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox: {
    width: 42,
    height: 50,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  resendText: {
    color: '#555',
    fontSize: 13,
  },
  resendLink: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 13,
  },
  resendDisabled: {
    color: '#aaa',
  },
  verifyButton: {
    marginTop: 16,
    backgroundColor: '#F2994A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  verifyText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkMark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  verifiedText: {
    fontSize: 13,
    color: '#22C55E',
    fontWeight: '600',
    marginTop: 2,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#B0C4DE',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default OTP