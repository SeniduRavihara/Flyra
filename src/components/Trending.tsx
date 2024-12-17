import React, { useCallback, useState } from "react";
import { AVPlaybackStatus, AVPlaybackStatusSuccess, ResizeMode, Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  ListRenderItem,
  ViewToken,
} from "react-native";

import { icons } from "../constants";

// Define the type for a single post item
interface Post {
  $id: string;
  video: string;
  thumbnail: string;
}

// Define the props for the `Trending` component
interface TrendingProps {
  posts: Post[];
}

// Define the props for the `TrendingItem` component
interface TrendingItemProps {
  activeItem: string | null;
  item: Post;
  playVideo: (id: string) => void;
}

// Define types for the viewability callback
interface ViewableItemsChangedInfo {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const zoomIn = {
  0: { transform: [{ scale: 0.9 }] },
  1: { transform: [{ scale: 1 }] },
};

const zoomOut = {
  0: { transform: [{ scale: 1 }] },
  1: { transform: [{ scale: 0.9 }] },
};

const TrendingItem: React.FC<TrendingItemProps> = ({
  activeItem,
  item,
  playVideo,
}) => {
  const isActive = activeItem === item.$id;
  const [play, setPlay] = useState(false);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (
      status.isLoaded && // Check if the video is loaded
      "didJustFinish" in status && // Ensure it's a success status
      (status as AVPlaybackStatusSuccess).didJustFinish
    ) {
      setPlay(false);
    }
  };

  return (
    <Animatable.View
      className="mr-5"
      animation={isActive ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={isActive}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
            playVideo(item.$id);
          }}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState<string | null>(
    posts[0]?.$id || null
  );

  // Handle viewable items change
  const viewableItemsChanged = useCallback(
    ({ viewableItems }: ViewableItemsChangedInfo) => {
      if (viewableItems.length > 0) {
        setActiveItem(viewableItems[0].key as string);
      }
    },
    []
  );

  // Viewability configuration
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70,
  };

  // Handle video playback state
  const playVideo = (id: string) => {
    if (activeItem !== id) {
      setActiveItem(id);
    }
  };

  // Render items in FlatList
  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <TrendingItem activeItem={activeItem} item={item} playVideo={playVideo} />
  );

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item, index) => item.$id || index.toString()}
      renderItem={renderItem}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      contentContainerStyle={{ paddingHorizontal: 170 }}
    />
  );
};

export default Trending;
