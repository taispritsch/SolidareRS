import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  login:{
    flex: 1,
    backgroundColor: '#9EC3FF',
    paddingHorizontal: 16, 
  },
  container: {
    flex: 1, 
    backgroundColor: '#133567',
    elevation: 1,
    zIndex: 1,
  },
  content: {
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 16, 
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    position: 'relative',
    borderColor: '#9EC3FF',
    borderWidth: 2,
    elevation: 1,
    zIndex: 1,
  },
  iconAndTextContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', 
    textAlign: 'center',
  },
  addButton: {
    position: 'relative', 
    alignSelf: 'flex-end',
    bottom: 20,
  }
});
