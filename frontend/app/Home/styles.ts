import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupar toda a tela
    backgroundColor: '#fff', // Fundo branco
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  content: {
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    
    paddingHorizontal: 16, 
  },
  title: {
    paddingTop: 30, 
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Cor do texto visível
    textAlign: 'center',
  },
});
