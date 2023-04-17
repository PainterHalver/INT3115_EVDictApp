import {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  View,
} from 'react-native';
import Animated, {
  WithSpringConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import MyModal from '../../component/MyModal';
import {COLORS} from '../../constants';
import {useDatabase} from '../../contexts/DatabaseContext';
import {useLoadingModal} from '../../contexts/LoadingModalContext';
import {Category} from '../../types';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  setCategories: (categories: Category[]) => void;
};

const springOptions: WithSpringConfig = {
  overshootClamping: true,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
  damping: 20,
  mass: 0.5,
  stiffness: 100,
};

export const AddCategoryModal = ({visible, onDismiss, setCategories}: Props) => {
  const {setLoading} = useLoadingModal();
  const [addCategoryName, setAddCategoryName] = useState<string>('');
  const {getCategories, addCategory} = useDatabase();
  const inputRef = useRef<TextInput>(null);

  const translateY = useSharedValue(0);

  const rTranslateY = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    const kbShowListener = Keyboard.addListener('keyboardDidShow', () => {
      translateY.value = withSpring(-125, springOptions);
    });

    const kbHideListener = Keyboard.addListener('keyboardDidHide', () => {
      translateY.value = withSpring(0, springOptions);
    });

    return () => {
      kbShowListener.remove();
      kbHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      setAddCategoryName('');
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  const addCategoryHandler = async () => {
    try {
      setLoading(true);
      if (!addCategoryName) {
        return ToastAndroid.show('Tên danh mục không được để trống!', ToastAndroid.SHORT);
      }
      await addCategory(addCategoryName);
      setCategories(await getCategories());
      onDismiss();
      ToastAndroid.show('Thêm thành công', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Đã có lỗi xảy ra, xin vui lòng thử lại sau', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyModal visible={visible} onDismiss={onDismiss}>
      <Animated.View style={[styles.modal, rTranslateY]}>
        <Text style={{color: COLORS.TEXT_BLACK, fontSize: 18, fontWeight: '500'}}>
          Tạo danh sách từ mới:
        </Text>
        <TextInput
          style={{
            backgroundColor: COLORS.BACKGROUND_WHITE_DARK,
            height: 40,
            borderRadius: 7,
            paddingHorizontal: 10,
          }}
          ref={inputRef}
          placeholder={'Tên danh sách'}
          value={addCategoryName}
          onChangeText={setAddCategoryName}
        />
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: -15,
            marginTop: 5,
          }}>
          <TouchableHighlight style={{flex: 1, borderBottomLeftRadius: 7}} onPress={onDismiss}>
            <View
              style={{
                backgroundColor: COLORS.BACKGROUND_CANCEL_BUTTON,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomLeftRadius: 7,
              }}>
              <Text style={{color: COLORS.TEXT_WHITE, fontSize: 16, fontWeight: '400'}}>Hủy</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{flex: 1, borderBottomRightRadius: 7}} onPress={addCategoryHandler}>
            <View
              style={{
                backgroundColor: COLORS.BACKGROUND_PRIMARY,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomRightRadius: 7,
              }}>
              <Text style={{color: COLORS.TEXT_WHITE, fontSize: 16, fontWeight: '400'}}>Tạo</Text>
            </View>
          </TouchableHighlight>
        </View>
      </Animated.View>
    </MyModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '80%',
    backgroundColor: COLORS.BACKGROUND_WHITE,
    padding: 15,
    paddingBottom: 0,
    borderRadius: 7,
    gap: 10,
    elevation: 5,
  },
});
