import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'

import { images } from '@/constants/images'
import { icons } from '@/constants/icons';

import MovieCard from "@/components/MovieCard";

import useFetch from "@/services/useFetch";
import { fetchPopularMovies } from "@/services/api";
import SearchBar from "@/components/SearchBar";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { 
    data: movies, 
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchPopularMovies({
      query: searchQuery
    }), false)

    useEffect(() => {
        const timeoutId = setTimeout( async () => {
          if(searchQuery.trim()) {
            await loadMovies();
          } else{
            reset();
          }
        }, 500);

        return () => {
          clearTimeout(timeoutId);
        }
    },[searchQuery])

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode="cover" />

      <FlatList 
        data={movies} 
        renderItem={({ item }) => <MovieCard {...item} />} 
        keyExtractor={(item) => item.id.toString()}
        className = "px-5"
        numColumns = {3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        
        contentContainerStyle={{ paddingBottom: 100}}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-3'>

              <Image source={icons.logo} className='w-12 h-10' />
            
            </View>

            <View className='my-5'>
              <SearchBar placeholder='Search Movies ...' value={searchQuery} 
              onChangeText={(text: string) => setSearchQuery(text)} />
            </View>
            
            {loading && (
              <ActivityIndicator size='large' color="#0000ff" className='my-3'/> 
            )}

            {error && (
              <Text className='text-red-500 px-5 my-3'>
                  Error: {error.message}
              </Text>
            )}

            {!loading && !error && 'SEARCH TERM'.trim() && movies?.length > 0 &&(

              <Text className="text-xl text-white font-bold">
                  Search Result for {' '}
                  <Text className='text-accent'>SEARCH TERM</Text>
              </Text>
            )}

          </>
        }
          ListEmptyComponent={
            !loading && !error ? (
           <View className='mt-10 px-5'> 
              <Text className='text-white text-lg font-bold text-center mt-5'>
              {searchQuery.trim() ? 'No Movies Found' : 'Search for a Movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default Search