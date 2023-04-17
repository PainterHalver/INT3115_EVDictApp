import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {
  LogBox,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import IoIcon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../../App';
import MyModal from '../../component/MyModal';
import {COLORS} from '../../constants';
import {useDatabase} from '../../contexts/DatabaseContext';
import {useLoadingModal} from '../../contexts/LoadingModalContext';
import {EditIcon} from '../../icons/EditIcon';
import {PlusIcon} from '../../icons/PlusIcon';
import {TrashIcon} from '../../icons/TrashIcon';
import {Category} from '../../types';
import {AddCategoryModal} from './AddCategoryModal';
import {EditCategoryModal} from './EditCategoryModal';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

type Props = StackScreenProps<RootStackParamList, 'YourWord'>;

const Bookmark = ({navigation, route}: Props) => {
  const {setLoading} = useLoadingModal();
  const {getCategories, addCategory, deleteCategory, editCategory} = useDatabase();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [addModalOpen, setAddModalOpen] = React.useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = React.useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category>();

  useEffect(() => {
    (async () => {
      try {
        setCategories(await getCategories());
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const deleteCategoryHandler = async () => {
    try {
      setLoading(true);
      await deleteCategory(selectedCategory!.id);
      setCategories(await getCategories());
      setDeleteModalOpen(false);
      ToastAndroid.show('Xóa thành công', ToastAndroid.LONG);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Đã có lỗi xảy ra, xin vui lòng thử lại sau', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.containerWrapper}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        animated={true}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginVertical: 10,
              gap: 10,
            }}>
            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              onPress={() => {
                navigation.goBack();
              }}>
              <IoIcon name="arrow-back-outline" size={25} color={COLORS.TEXT_WHITE} />
            </TouchableOpacity>
            <Text
              style={{
                color: COLORS.TEXT_WHITE,
                fontSize: 20,
                fontWeight: '400',
                marginRight: 'auto',
              }}>
              Sổ tay
            </Text>
            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              onPress={() => setAddModalOpen(true)}>
              <PlusIcon size={25} color={COLORS.TEXT_WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <ScrollView
            contentContainerStyle={{paddingHorizontal: 10, gap: 10, paddingTop: 15, paddingBottom: 20}}>
            {categories.map((category, index) => {
              return (
                <TouchableNativeFeedback
                  key={index}
                  onPress={() => {
                    navigation.navigate('CategoryScreen', {category: category});
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: COLORS.BACKGROUND_WHITE,
                      paddingHorizontal: 15,
                      gap: 15,
                      paddingVertical: 10,
                      borderRadius: 7,
                      elevation: 1,
                    }}>
                    <View style={{gap: 5, marginRight: 'auto'}}>
                      <Text style={{fontSize: 18, color: COLORS.TEXT_BLACK}}>
                        {category.name.length > 24 ? category.name.slice(0, 24) + '...' : category.name}
                      </Text>
                      <Text style={{fontSize: 15, color: COLORS.TEXT_GRAY}}>
                        {category.created_at}・{category.count} từ
                      </Text>
                    </View>
                    <TouchableOpacity
                      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                      onPress={() => {
                        setSelectedCategory(category);
                        setEditModalOpen(true);
                      }}>
                      <View>
                        <EditIcon size={25} color={COLORS.TEXT_GRAY} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                      onPress={() => {
                        setSelectedCategory(category);
                        setDeleteModalOpen(true);
                      }}>
                      <View>
                        <TrashIcon size={25} color={COLORS.RED} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableNativeFeedback>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Add category model */}
      <AddCategoryModal
        visible={addModalOpen}
        onDismiss={() => setAddModalOpen(false)}
        setCategories={setCategories}
      />

      {/* Delete confirm modal */}
      <MyModal visible={deleteModalOpen} onDismiss={() => setDeleteModalOpen(false)}>
        <View style={styles.modal}>
          <Text style={{color: COLORS.TEXT_BLACK, fontSize: 18, fontWeight: '500'}}>Xóa danh sách</Text>
          <Text style={{color: COLORS.TEXT_BLACK, fontSize: 16, fontWeight: '400'}}>
            Bạn có chắc chắn muốn xóa '{selectedCategory?.name}' không?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: -15,
              marginTop: 5,
            }}>
            <TouchableHighlight
              style={{flex: 1, borderBottomLeftRadius: 7}}
              onPress={() => setDeleteModalOpen(false)}>
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
            <TouchableHighlight
              style={{flex: 1, borderBottomRightRadius: 7}}
              onPress={deleteCategoryHandler}>
              <View
                style={{
                  backgroundColor: COLORS.RED,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomRightRadius: 7,
                }}>
                <Text style={{color: COLORS.TEXT_WHITE, fontSize: 16, fontWeight: '400'}}>Xóa</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </MyModal>

      {/* Edit category model */}
      <EditCategoryModal
        visible={editModalOpen}
        onDismiss={() => setEditModalOpen(false)}
        setCategories={setCategories}
        selectedCategory={selectedCategory}
      />
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_WHITE_DARK,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    position: 'relative',
  },
  bodyContainer: {
    flex: 1,
  },
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
