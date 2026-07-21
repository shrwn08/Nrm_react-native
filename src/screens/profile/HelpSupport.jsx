import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, typography } from "../../theme/theme"


const FAQS = [
  {
    question: 'How do I place a new rod order?',
    answer: 'Go to the Home tab, fill in the party name, type, diameters and quantities, add a shipping address, then tap Place order.',
  },
  {
    question: 'Can I change a shipping address after placing an order?',
    answer: 'Not yet from within the app. Contact support and we can update it for you before the order is dispatched.',
  },
  {
    question: 'How do I track my order status?',
    answer: 'Open the Orders tab and filter by status - Pending, Confirmed, Dispatched, Delivered, or Cancelled.',
  },
  {
    question: 'I forgot my password. What do I do?',
    answer: 'Use the "Forgot password" link on the login screen to reset it via OTP.',
  },
];

const CONTACT_OPTIONS = [
  {
    label: 'Call support',
    value: '+91 98765 xxxxx',
    icon: 'call-outline',
    action: () => Linking.openURL('tel:+919876543210'),
  },
  {
    label: 'Email support',
    value: 'support@example.com',
    icon: 'mail-outline',
    action: () => Linking.openURL('mailto:support@example.com'),
  },
  {
    label: 'WhatsApp',
    value: '+91 98765 43210',
    icon: 'logo-whatsapp',
    action: () => Linking.openURL('https://wa.me/919876543210'),
  },
];

function FaqItem({ question, answer }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textMuted}
        />
      </View>
      {expanded ? <Text style={styles.faqAnswer}>{answer}</Text> : null}
    </TouchableOpacity>
  );
}

function HelpSupport() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Help & support</Text>

      <Text style={styles.sectionLabel}>Contact us</Text>
      <View style={styles.card}>
        {CONTACT_OPTIONS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.contactRow,
              index === CONTACT_OPTIONS.length - 1 && styles.rowLast,
            ]}
            onPress={item.action}
          >
            <View style={styles.contactIconWrap}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.contactTextWrap}>
              <Text style={styles.contactLabel}>{item.label}</Text>
              <Text style={styles.contactValue}>{item.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Frequently asked questions</Text>
      <View style={styles.card}>
        {FAQS.map((faq, index) => (
          <View
            key={faq.question}
            style={index === FAQS.length - 1 ? styles.faqWrapLast : styles.faqWrap}
          >
            <FaqItem question={faq.question} answer={faq.answer} />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextWrap: {
    flex: 1,
  },
  contactLabel: {
    ...typography.body,
    fontSize: 15,
  },
  contactValue: {
    ...typography.caption,
    marginTop: 2,
  },
  faqWrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqWrapLast: {},
  faqItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  faqQuestion: {
    ...typography.body,
    fontSize: 15,
    flex: 1,
  },
  faqAnswer: {
    ...typography.caption,
    marginTop: spacing.xs + 2,
    lineHeight: 19,
  },
});

export default HelpSupport