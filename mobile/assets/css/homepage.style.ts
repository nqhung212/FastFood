import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** ---------- HEADER ---------- */
  header: {
    backgroundColor: '#fb5252ff',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subText: {
    color: '#ffeaea',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 4,
  },

  /** ---------- SEARCH ---------- */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: -20, // nổi lên một chút để giao với header
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    height: 40,
    color: '#000',
  },

  /** ---------- BANNER ---------- */
  bannerContainer: {
    marginVertical: 20,
  },
  banner: {
    width: width - 40,
    height: 180,
    marginHorizontal: 10,
    borderRadius: 15,
    resizeMode: 'cover',
  },

  /** ---------- SECTION ---------- */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 20,
    marginBottom: 10,
    color: '#222',
  },

  /** ---------- CATEGORY ---------- */
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
  },
  categoryText: {
    marginTop: 6,
    fontWeight: '600',
    color: '#333',
    fontSize: 13,
  },

  /** ---------- PRODUCT ---------- */
  productContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  productCard: {
    width: width / 2.2,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  productName: {
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
  },
  productPrice: {
    textAlign: 'center',
    color: '#fb5252ff',
    fontWeight: '700',
    marginTop: 4,
    fontSize: 15,
  },

  /** ---------- ADD TO CART ---------- */
  addToCartButton: {
    marginTop: 8,
    backgroundColor: '#fb5252ff',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '700',
  },
});
