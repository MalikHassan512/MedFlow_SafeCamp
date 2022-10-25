import React from 'react';
import {TouchableOpacity} from 'react-native';
import styles from './styles';
import {ICON_CONSTANTS} from '../../constants';
import {SwipeListView} from 'react-native-swipe-list-view';

const SwipeDelete = ({
  tests,
  renderItem,
  onDeletePress,
  isDisabled,
  disableSwipe,
}) => {
  return (
    <SwipeListView
      disableLeftSwipe={disableSwipe}
      disableRightSwipe={disableSwipe}
      showsVerticalScrollIndicator={false}
      data={tests}
      keyExtractor={item => item.id}
      renderItem={({item, index}) => renderItem(item, index)}
      renderHiddenItem={(data, rowMap) => (
        <>
          {isDisabled ? null : ( 
            <TouchableOpacity
              style={styles.swipeView}
              onPress={() => onDeletePress(data.item)}
            >
              <ICON_CONSTANTS.MCIcon
                style={styles.deleteIcon}
                name="delete-outline"
              />
            </TouchableOpacity>
          )}
        </>
      )}
      rightOpenValue={isDisabled ? 0 : -100}
    />
  );
};

export default SwipeDelete;
