import React, { useRef, useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'

function OTP() {

  const route = useRoute()

  // Pre-fill from whatever the previous screen passed, but keep both
  // editable here since this screen is now responsible for collecting
  // email + phone for verification (not just displaying phone_no).
  const [email, setEmail] = useState(route.params?.email || '')
  const [phoneNo, setPhoneNo] = useState(route.params?.phone_no || '')

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  // Countdown for resend, starts at 30 seconds
  const [timer, setTimer] = useState(30)

  useEffect(() => {
    if (timer === 0) return

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    // Cleanup avoids stacking multiple intervals on re-renders
    return () => clearInterval(interval)
  }, [timer])

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

  const handleSubmit = () => {
    const code = otp.join('')

    if (!email.trim()) {
      alert('Please enter your email')
      return
    }

    if (!phoneNo.trim()) {
      alert('Please enter your phone number')
      return
    }

    if (code.length < 6) {
      alert('Please enter the complete 6-digit OTP')
      return
    }

    // replace with your actual verify-OTP API call —
    // send email, phone_no, and code together so the backend
    // can confirm the OTP matches this phone/email pair
    console.log('Submitting OTP:', code, 'for', phoneNo, email)
  }

  const handleResend = () => {
    if (timer > 0) return

    if (!phoneNo.trim()) {
      alert('Please enter your phone number first')
      return
    }

    // replace with your actual resend-OTP API call
    console.log('Resending OTP to', phoneNo)

    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0].focus()
    setTimer(30)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Verify Your Details</Text>
      <Text style={styles.subtext}>
        Confirm your email and phone number, then enter the OTP
      </Text>

      {/* Email — new field */}
      <View style={styles.inputContainer}>
        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Phone Number — now editable here instead of just displayed */}
      <View style={styles.inputContainer}>
        <Text style={styles.fieldLabel}>Phone Number</Text>
        <TextInput
          placeholder="+91 98765XXXXX"
          style={styles.textInput}
          value={phoneNo}
          onChangeText={setPhoneNo}
          keyboardType="phone-pad"
        />
      </View>

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

      {/* Resend row: countdown while active, tappable once it hits 0 */}
      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
          <Text style={[styles.resendLink, timer > 0 && styles.resendDisabled]}>
            {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
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
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
    fontWeight: '500',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DADDE2',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    fontSize: 20,
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    color: '#555',
  },
  resendLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  resendDisabled: {
    color: '#aaa',
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default OTP