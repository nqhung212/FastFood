import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/service/supabaseClient';
import { useRouter } from 'expo-router';
import { styles } from '@/assets/css/orderHistory.style';

export default function ActiveOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const saved = await AsyncStorage.getItem('user');
        if (!saved) {
          if (mounted) setUser(null);
          return;
        }
        const parsed = JSON.parse(saved);
        if (mounted) setUser(parsed);

        const { data, error } = await supabase
          .from('order')
          .select('*')
          .eq('customer_id', parsed.id)
          .neq('order_status', 'completed')
          .order('created_at', { ascending: false });

        if (error) console.warn('load active orders err', error.message);
        if (mounted) setOrders(data || []);
      } catch (err) {
        console.warn(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  // Realtime: listen to inserts/updates/deletes for this user's orders
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`active_orders_${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order', filter: `customer_id=eq.${user.id}` }, (p: any) => {
        const row = p.new;
        if (row && row.order_status !== 'completed') {
          setOrders(prev => [row, ...prev]);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'order', filter: `customer_id=eq.${user.id}` }, (p: any) => {
        const row = p.new;
        setOrders(prev => {
          const idx = prev.findIndex(o => o.order_id === row.order_id);
          // if updated to completed -> remove
          if (row.order_status === 'completed') {
            if (idx !== -1) prev.splice(idx, 1);
            return [...prev];
          }
          // update or insert
          if (idx !== -1) {
            prev[idx] = row;
            return [...prev];
          }
          return [row, ...prev];
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'order', filter: `customer_id=eq.${user.id}` }, (p: any) => {
        const old = p.old;
        setOrders(prev => prev.filter(o => o.order_id !== old.order_id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff7b5f" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.text}>Vui lòng đăng nhập để xem đơn hàng hoạt động</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>📦 Đơn hàng đang xử lý</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>Không có đơn hàng đang xử lý.</Text>
        ) : (
          orders.map(order => (
            <TouchableOpacity
              key={order.order_id}
              style={styles.orderCard}
              onPress={() => router.push({ pathname: '/(tabs)/order', params: { orderId: order.order_id } })}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderCode}>Mã đơn: #{order.order_id?.slice(0,8)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: order.order_status === 'delivering' ? '#47cba1ff' : '#f39c12' }]}>
                  <Text style={styles.statusText}>{order.order_status}</Text>
                </View>
              </View>
              <Text style={styles.orderDate}>Ngày: {new Date(order.created_at).toLocaleDateString('vi-VN')}</Text>
              <Text style={styles.orderTotal}>Tổng: {Number(order.total_price).toLocaleString('vi-VN')}₫</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
