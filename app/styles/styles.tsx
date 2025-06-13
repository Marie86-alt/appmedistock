import { StyleSheet, Platform } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: theme.spacing.m, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: theme.spacing.xl },
  appTitle: { fontSize: theme.typography.fontSizes.title, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.xs },
  appSubtitle: { fontSize: theme.typography.fontSizes.medium, color: theme.colors.textSecondary },
  formContainer: { width: '100%' },
  generalError: { color: theme.colors.error, fontSize: theme.typography.fontSizes.medium, textAlign: 'center', marginBottom: theme.spacing.m, padding: theme.spacing.s, backgroundColor: '#FFEBEE', borderRadius: theme.borderRadius.small },
  label: { fontSize: theme.typography.fontSizes.medium, fontWeight: '600', marginBottom: theme.spacing.xs, color: theme.colors.text },
  input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.medium, padding: theme.spacing.m, fontSize: theme.typography.fontSizes.medium, marginBottom: theme.spacing.m, backgroundColor: theme.colors.surface },
  inputShadow: Platform.OS === 'web' ? {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  } : {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: { color: theme.colors.error, fontSize: theme.typography.fontSizes.small, marginTop: -theme.spacing.m, marginBottom: theme.spacing.m },
  registerButton: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.medium, padding: theme.spacing.m, alignItems: 'center', justifyContent: 'center', height: 50, marginBottom: theme.spacing.l, marginTop: theme.spacing.s },
  disabledButton: { backgroundColor: theme.colors.disabled },
  registerButtonText: { color: 'white', fontSize: theme.typography.fontSizes.large, fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.xl },
  loginText: { fontSize: theme.typography.fontSizes.medium, color: theme.colors.textSecondary },
  loginLink: { fontSize: theme.typography.fontSizes.medium, color: theme.colors.primary, fontWeight: '600' },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginBottom: theme.spacing.m },
  forgotPasswordText: { color: theme.colors.primary, fontSize: theme.typography.fontSizes.medium },
  loginButton: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.medium, padding: theme.spacing.m, alignItems: 'center', justifyContent: 'center', height: 50, marginBottom: theme.spacing.l },
  loginButtonDisabled: { backgroundColor: theme.colors.disabled },
  loginButtonText: { color: 'white', fontSize: theme.typography.fontSizes.large, fontWeight: '600' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.xs },
  registerText: { fontSize: theme.typography.fontSizes.medium, color: theme.colors.textSecondary },
  registerLink: { fontSize: theme.typography.fontSizes.medium, color: theme.colors.primary, fontWeight: '600' },
});




