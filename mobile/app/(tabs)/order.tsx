import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/service/supabaseClient';

const STATUS_ORDER = ['pending', 'confirmed', 'preparing', 'delivering', 'completed'] as const;

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams() as { orderId?: string };
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!orderId) return;
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data: odata, error: oerr } = await supabase
          .from('order')
          .select('*')
          .eq('order_id', orderId)
          .single();

        if (oerr) console.warn('load order err', oerr.message);
        if (mounted && odata) setOrder(odata);

        // fetch order items + product info
        const { data: itdata, error: iterr } = await supabase
          .from('order_item')
          .select('*, product(*)')
          .eq('order_id', orderId);
        if (iterr) console.warn('order items err', iterr.message);
        if (mounted && itdata) setItems(itdata || []);
      } catch (err) {
        console.warn(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, [orderId]);

  // Realtime subscription: listen for changes to this order and delivery_tracking
  useEffect(() => {
    if (!orderId) return;
    // create a channel and listen to multiple table events so the detail view stays up-to-date
    const channel = supabase.channel(`order_sub_${orderId}`);

    // order row changes - listen to INSERT / UPDATE / DELETE explicitly
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'order', filter: `order_id=eq.${orderId}` },
      (payload: any) => {
        console.log('realtime order INSERT', payload?.eventType, payload?.new ? Object.keys(payload.new) : null);
        if (payload?.new) {
          setOrder((prev: any) => ({ ...(prev || {}), ...(payload.new || {}) }));
          setTick(t => t + 1);
        }
      }
    );
    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'order', filter: `order_id=eq.${orderId}` },
      (payload: any) => {
        console.log('realtime order UPDATE', payload?.eventType, payload?.new ? Object.keys(payload.new) : null);
        if (payload?.new) {
          setOrder((prev: any) => ({ ...(prev || {}), ...(payload.new || {}) }));
          setTick(t => t + 1);
        }
      }
    );
    channel.on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'order', filter: `order_id=eq.${orderId}` },
      (payload: any) => {
        console.log('realtime order DELETE', payload?.eventType, payload?.old ? Object.keys(payload.old) : null);
        if (payload?.old) {
          setOrder(null);
          router.back();
        }
      }
    );

    // order items changes -> refresh items list (safe and simple)
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'order_item', filter: `order_id=eq.${orderId}` },
      async (payload: any) => {
        console.log('realtime order_item INSERT', payload?.eventType, payload?.new ? payload.new.order_item_id : null);
        try {
          const { data: itdata, error: iterr } = await supabase
            .from('order_item')
            .select('*, product(*)')
            .eq('order_id', orderId);
          if (!iterr) setItems(itdata || []);
        } catch (err) {
          console.warn('realtime refresh items err', err);
        }
        setTick(t => t + 1);
      }
    );
    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'order_item', filter: `order_id=eq.${orderId}` },
      async (payload: any) => {
        console.log('realtime order_item UPDATE', payload?.eventType, payload?.new ? payload.new.order_item_id : null);
        try {
          const { data: itdata, error: iterr } = await supabase
            .from('order_item')
            .select('*, product(*)')
            .eq('order_id', orderId);
          if (!iterr) setItems(itdata || []);
        } catch (err) {
          console.warn('realtime refresh items err', err);
        }
        setTick(t => t + 1);
      }
    );
    channel.on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'order_item', filter: `order_id=eq.${orderId}` },
      async (payload: any) => {
        console.log('realtime order_item DELETE', payload?.eventType, payload?.old ? payload.old.order_item_id : null);
        try {
          const { data: itdata, error: iterr } = await supabase
            .from('order_item')
            .select('*, product(*)')
            .eq('order_id', orderId);
          if (!iterr) setItems(itdata || []);
        } catch (err) {
          console.warn('realtime refresh items err', err);
        }
        setTick(t => t + 1);
      }
    );

    // delivery tracking changes -> merge into order
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'delivery_tracking', filter: `order_id=eq.${orderId}` },
      (payload: any) => {
        console.log('realtime delivery_tracking INSERT', payload?.eventType, payload?.new ? Object.keys(payload.new) : null);
        if (payload?.new) {
          setOrder((prev: any) => (prev ? { ...prev, delivery_tracking: payload.new } : prev));
          setTick(t => t + 1);
        }
      }
    );
    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'delivery_tracking', filter: `order_id=eq.${orderId}` },
      (payload: any) => {
        console.log('realtime delivery_tracking UPDATE', payload?.eventType, payload?.new ? Object.keys(payload.new) : null);
        if (payload?.new) {
          setOrder((prev: any) => (prev ? { ...prev, delivery_tracking: payload.new } : prev));
          setTick(t => t + 1);
        }
      }
    );
    channel.on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'delivery_tracking', filter: `order_id=eq.${orderId}` },
      (payload: any) => {
        console.log('realtime delivery_tracking DELETE', payload?.eventType, payload?.old ? Object.keys(payload.old) : null);
        if (payload?.old) {
          setOrder((prev: any) => (prev ? { ...prev, delivery_tracking: null } : prev));
          setTick(t => t + 1);
        }
      }
    );

    // subscribe (no Promise.catch on RealtimeChannel in this client)
    try {
      channel.subscribe();
    } catch (err: any) {
      console.warn('subscribe err', err);
    }

    // Fallback: periodic poll (runs every 5s) to ensure UI updates if realtime isn't firing
    let pollTimer: any = null;
    try {
      pollTimer = setInterval(async () => {
        try {
          const { data: fresh, error: ferr } = await supabase.from('order').select('*').eq('order_id', orderId).single();
          if (ferr) {
            // ignore
            return;
          }
          if (fresh) {
            setOrder((prev: any) => {
              // naive deep-compare to avoid unnecessary re-renders
              try {
                if (JSON.stringify(prev) !== JSON.stringify(fresh)) return fresh;
              } catch (e) {
                return fresh;
              }
              return prev;
            });
          }
        } catch (err) {
          // ignore poll error
        }
      }, 5000);
    } catch (err: any) {
      console.warn('poll setup err', err);
    }

    return () => {
      try { supabase.removeChannel(channel); } catch (e) { /* ignore */ }
      try { if (pollTimer) clearInterval(pollTimer); } catch (e) { /* ignore */ }
    };
  }, [orderId]);

  if (!orderId) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Không tìm thấy mã đơn</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#ff7b5f" />
      </SafeAreaView>
    );
  }

  const statusIndex = STATUS_ORDER.indexOf(order?.order_status || 'pending');

  const markReceived = async () => {
    if (!order) return;
    Alert.alert('Xác nhận', 'Bạn đã nhận được hàng?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xác nhận', onPress: async () => {
        setBusy(true);
        try {
          const { error } = await supabase.from('order').update({ order_status: 'completed' }).eq('order_id', order.order_id);
          if (error) {
            console.warn('update order failed', error.message);
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái (kiểm tra quyền).');
          } else {
            // refresh
            const { data } = await supabase.from('order').select('*').eq('order_id', order.order_id).single();
            setOrder(data || order);
            Alert.alert('Thành công', 'Cảm ơn! Đơn hàng đã được đánh dấu là hoàn thành.');
          }
        } catch (err) {
          console.warn(err);
          Alert.alert('Lỗi', 'Có lỗi xảy ra.');
        } finally { setBusy(false); }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Tình trạng đơn hàng</Text>

        <View style={styles.stepsRow}>
          {STATUS_ORDER.map((s, idx) => (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepCircle, idx <= statusIndex ? styles.stepActive : undefined]}>
                {idx <= statusIndex && <Text style={styles.stepCheck}>✓</Text>}
              </View>
              <Text style={styles.stepLabel}>{s === 'pending' ? 'Pending' : s.charAt(0).toUpperCase() + s.slice(1)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
          <View style={styles.row}><Text style={styles.label}>Mã đơn:</Text><Text style={styles.value}> {order.order_id?.slice(0,8)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Ngày:</Text><Text style={styles.value}> {new Date(order.created_at).toLocaleDateString('vi-VN')}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Trạng thái đơn:</Text><Text style={styles.badge}>{order.order_status?.toUpperCase()}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Trạng thái thanh toán:</Text><Text style={styles.badge}>{order.payment_status?.toUpperCase()}</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Món trong đơn</Text>
          {items.length === 0 ? (
            <Text>Không có món trong đơn.</Text>
          ) : (
            items.map(it => (
              <View key={it.order_item_id} style={styles.itemRow}>
                <Text style={{ fontWeight: '600' }}>{it.product?.name || it.product_name}</Text>
                <Text>{it.quantity} x {Number(it.price).toLocaleString('vi-VN')}₫</Text>
              </View>
            ))
          )}
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={styles.label}>Tổng:</Text>
            <Text style={{ fontWeight: '700' }}>{Number(order.total_price).toLocaleString('vi-VN')}₫</Text>
          </View>
        </View>

        {order.order_status === 'delivering' && (
          <TouchableOpacity style={[styles.primaryBtn, busy && { opacity: 0.6 }]} disabled={busy} onPress={markReceived}>
            <Text style={styles.primaryBtnText}>Đã nhận hàng</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.linkBtn} onPress={() => router.back()}>
          <Text style={{ color: '#666' }}>Quay lại</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, paddingHorizontal: 4 },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  stepActive: { backgroundColor: '#47cba1ff' },
  stepCheck: { color: 'white', fontWeight: '700' },
  stepLabel: { marginTop: 6, fontSize: 12, color: '#444' },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#f1f3f5' },
  sectionTitle: { fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#666' },
  value: { fontWeight: '600' },
  badge: { backgroundColor: '#ffd966', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  itemRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  primaryBtn: { backgroundColor: '#198754', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: 'white', fontWeight: '700' },
  linkBtn: { marginTop: 12, alignItems: 'center' }
});
