import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  content: {
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 16, 
  },
  iconAndTextContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: 10, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', 
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute', 
    right: 30, 
    bottom: 30, 
  }
});
