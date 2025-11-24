import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/service/supabaseClient';
import { useCart } from './CartContext';

type CartRow = {
  product_id: string;
  quantity: number;
  price: number;
  product?: any;
};

type Group = {
  restaurantId: string;
  restaurantName?: string;
  logo?: string | null;
  items: Array<{ id: string; name: string; image?: string | null; price: number; quantity: number }>;
  totalItems: number;
  totalPrice: number;
};

export default function CartScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [manageMode, setManageMode] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { cart, removeFromCart } = useCart();

  // build groups from unified cart whenever cart changes
  useEffect(() => {
    const build = async () => {
      setLoading(true);
      try {
        const map = new Map<string, Group>();
        for (const it of cart) {
          const rid = it.restaurant_id ?? 'unknown';
          const g = map.get(rid) || ({ restaurantId: rid, items: [], totalItems: 0, totalPrice: 0 } as Group);
          g.items.push({ id: String(it.id), name: it.name, image: it.image ?? null, price: Number(it.price || 0), quantity: Number(it.quantity || 0) });
          g.totalItems += Number(it.quantity || 0);
          g.totalPrice += Number((it.price || 0) * (it.quantity || 0));
          map.set(rid, g);
        }

        // fetch restaurant metadata for nicer display
        const restaurantIds = Array.from(map.keys()).filter((id) => id && id !== 'unknown');
        if (restaurantIds.length > 0) {
          const { data: restData } = await supabase.from('restaurant').select('restaurant_id,name,logo_url').in('restaurant_id', restaurantIds as any[]);
          const restMap = new Map<string, any>();
          (restData || []).forEach((r: any) => restMap.set(String(r.restaurant_id), r));
          for (const [rid, g] of map.entries()) {
            const meta = restMap.get(rid);
            if (meta) {
              g.restaurantName = meta.name;
              g.logo = meta.logo_url ?? null;
            }
          }
        }

        setGroups(Array.from(map.values()));
      } catch (e) {
        console.error('Error building grouped cart', e);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    build();
  }, [cart]);

  const renderRow = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        // navigate to menu for that restaurant
        router.push(`/(tabs)/menu?restaurantId=${item.restaurantId}`);
      }}
    >
      <View style={styles.rowLeft}>
        <Image source={{ uri: item.logo || 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png' }} style={styles.logo} />
      </View>
      <View style={styles.rowCenter}>
        <Text style={styles.title}>{item.restaurantName || 'Nhà hàng'}</Text>
        <Text style={styles.subtitle}>{item.totalItems} món • { (item.totalPrice || 0).toLocaleString() }₫</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.chev}>{'›'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF6347" /></View>;

  if (groups.length === 0) return <View style={styles.center}><Text>Giỏ hàng của bạn đang trống</Text></View>;

  const removeItem = async (restaurantId: string, itemId: string) => {
    try {
      // delegate removal to CartContext so all listeners update
      await removeFromCart(itemId);
    } catch (e) {
      console.error('Error removing item', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }}>
        <Text style={styles.header}>Giỏ hàng của tôi</Text>
        <TouchableOpacity onPress={() => { setManageMode(!manageMode); setExpanded(null); }} style={{ padding: 8 }}>
          <Text style={{ color: '#007AFF', fontWeight: '600' }}>{manageMode ? 'Xong' : 'Quản lý'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(g) => g.restaurantId}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                if (manageMode) {
                  setExpanded((prev) => (prev === item.restaurantId ? null : item.restaurantId));
                } else {
                  // Navigate to checkout pre-filtered for this restaurant
                  router.push(`/payment/checkout?restaurantId=${item.restaurantId}`);
                }
              }}
            >
              <View style={styles.rowLeft}>
                <Image source={{ uri: item.logo || 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png' }} style={styles.logo} />
              </View>
              <View style={styles.rowCenter}>
                <Text style={styles.title}>{item.restaurantName || 'Nhà hàng'}</Text>
                <Text style={styles.subtitle}>{item.totalItems} món • { (item.totalPrice || 0).toLocaleString() }₫</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.chev}>{'›'}</Text>
              </View>
            </TouchableOpacity>

            {/* expanded item list when in manage mode */}
            {manageMode && expanded === item.restaurantId && (
              <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
                {item.items.map((it) => (
                  <View key={it.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' }}>
                    <Image source={{ uri: it.image || 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png' }} style={{ width: 52, height: 52, borderRadius: 6, marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>{it.name}</Text>
                      <Text style={{ color: '#666' }}>{it.quantity} x {it.price.toLocaleString()}₫</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeItem(item.restaurantId, it.id)} style={{ padding: 8 }}>
                      <Ionicons name="trash-outline" size={22} color="#d00" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { fontSize: 20, fontWeight: '700', padding: 16 },
  row: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  rowLeft: { width: 64, height: 64, marginRight: 12 },
  logo: { width: 64, height: 64, borderRadius: 8 },
  rowCenter: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { color: '#666', marginTop: 4 },
  rowRight: { width: 24, alignItems: 'center' },
  chev: { fontSize: 22, color: '#ccc' },
});
