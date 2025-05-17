import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import VisNetwork, { Data, Node, VisNetworkRef } from 'react-native-vis-network';
import { Button } from '../../components/Button';
import { authTokenAtom, contentAtom, contentPropertiesAtom, courseCircleAtom, isLoggedInAtom, selectedNodeAtom } from '../atoms';

interface Circle {
  id: number;
  name: string;
  value: number;
  // Add other properties as needed based on your API response
}

interface NodeData extends Node {
  label: string;
  value: number;
  color?: string;
  size?: number;

}

interface NetworkData extends Data {
  nodes: NodeData[];
}

const FALLBACK_DATA: Data = {
  edges: [
    { from: 1, to: 3, dashes: false, width: 3 },
    { from: 1, to: 2, dashes: false },  
    { from: 1, to: 4 ,  dashes: true},
    { from: 1, to: 5 ,  dashes: true,},


   
  ],

  nodes: [
    { id: 1, label: '000000', value: 100, color: '#ffa100', },
    { id: 2, label: 'N', value: 200,  },
    { id: 3, label: 'N', value: 300, size: 60,  },
    { id: 4, label: 'N', value: 400, size: 60,  },

   

  ],


};


const FALLBACK_PROPERTIES: any = [


  {
    id: 1,
    trust: 100,
    risk: 0,
    color: '#ffa100',
    meetingType: 'none',
  },
  {
    id: 2,
    trust: 40,
    risk: 20,
    color: '#ffa100',
    meetingType: 'virtual',
  },
  {
    id: 3,
    trust: 70,
    risk: 0,
    color: '#ffa100',
    meetingType: 'in-person',
  },
  {
    id: 4,
    trust: 70,
    risk: 20,
    color: '#ffa100',
    meetingType: 'virtual',
  },



]

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingCircles, setIsLoadingCircles] = useState<boolean>(false);
  const visNetworkRef = useRef<VisNetworkRef>(null);
  const setSelectedNode = useSetAtom(selectedNodeAtom);
  const [content, setContent] = useAtom(contentAtom);
  const [authToken] = useAtom(authTokenAtom);
  const [data, setData] = useAtom(courseCircleAtom);
  const [properties, setProperties] = useAtom(contentPropertiesAtom);

  interface ContentProperty {
    id: number;
    trust: number;
    risk: number;
    color: string;
    meetingType: 'none' | 'virtual' | 'in-person';
  }

  const updateEdgesBasedOnProperties = () => {
    
    setLoading(true);
    if (!data.nodes || !properties) return;

    const newEdges = data.nodes.map((node: NodeData) => {
      if (node.id === 1) return null; // Skip the center node
      
      const nodeProperties = properties.find((prop: any) => prop.id === node.id);
      if (!nodeProperties) return null;

      let edge;
      if (node.id === 4) {
      edge = {
        from: 1,
        to: node.id,

        width: 3,
      };
      }
      else {
        edge = {
          from: 1,
          to: node.id,
          width: 1,
        };
      }


      

      switch (nodeProperties.meetingType) {
        case 'none':
          return { ...edge, color: 'transparent' };
        case 'virtual':
          return { ...edge, dashes: true };
        case 'in-person':
          return { ...edge, dashes: false };
        default:
          return { ...edge, color: 'transparent' };
      }
    }).filter(Boolean);

    setData((prev: NetworkData) => ({
      ...prev,
      edges: newEdges,
    }));
  };

  useEffect(() => {
    // Initialize with fallback data if empty
    if (!data || !data.nodes || data.nodes?.length === 0) {
      setData(FALLBACK_DATA);
      setProperties(FALLBACK_PROPERTIES);
      console.log(properties);
      console.log(data);
      
      updateEdgesBasedOnProperties();
    }
  }, []);

  useEffect(() => {
    console.log(properties);
    console.log(data);
  }, [properties, data]);

  // Update edges when properties change
  useEffect(() => {
    updateEdgesBasedOnProperties();
  }, [properties]);

  // Update properties when content changes
  useEffect(() => {
    if (content && properties) {
      const newProperties = properties.map((prop: ContentProperty) => 
        prop.id === content.id ? { ...prop, ...content } : prop
      );
      setProperties(newProperties);
    }
  }, [content]);

  useEffect(() => {
    if (!loading || !visNetworkRef.current) {
      return;
    }

    const subscription = visNetworkRef.current.addEventListener(
      'click',
      (event: any) => {
        if (event.nodes.length > 0) { 
          if (event.nodes[0] === 1) {
            addNewConnection()
            return;
          }
          
          const node = data.nodes?.find((node: Node) => node.id === event.nodes[0]);
          const nodeProperties = properties.find((property: any) => property.id === node?.id);
          setSelectedNode(node);
          setContent(nodeProperties);

          handleOpenUser();
        }
      }
    );

    return subscription.remove;
  }, [loading, data.nodes]);

  const handleSignOut = () => {
    setIsLoggedIn(false);

    router.replace('/login');
    setData(FALLBACK_DATA);
  };

  const handleOpenUser = () => {
    router.push('/(screens)/user');
  };

  const addNewConnection = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Generate new ID
        const newId = Math.max(...data.nodes.map((node: NodeData) => node.id)) + 1;

        // Add new node
        const newNode: NodeData = {
          id: newId,
          label: 'New',
          value: 300,
          size: 60,
        };

        // Add new edge
        const newEdge = {
          from: 1,
          to: newId,
          color: 'transparent',
          width: 1,
        };

        // Add new property
        const newProperty: ContentProperty = {
          id: newId,
          trust: 0,
          risk: 20,
          color: '#ffa100',
          meetingType: 'none',
        };

        // Update all states
        setData((prev: NetworkData) => ({
          ...prev,
          nodes: [...prev.nodes, newNode],
          edges: [...(prev.edges || []), newEdge],
        }));

        setProperties((prev: ContentProperty[]) => [...prev, newProperty]);

        resolve();
      }, 1000);






    });
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? '#3A3A3C' : '#f5f5f7' }
    ]}>
      <View style={styles.buttonContainer}>
        <VisNetwork 
          style={styles.visNetwork}
          options={{
            nodes: {
              shape: 'circle',
              size: 160,
              color: '#0049bd',
              font: {
                color: 'transparent',
              },
            },
            edges: {
              color: 'blue',
              width: 1,
            },
          }}
          data={data}
          ref={visNetworkRef}
          onLoad={() => setLoading(true)}
        />
        <Button onPress={handleSignOut} text="Sign Out" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    gap: 20,
    width: '100%',
    height: '100%'
  },
  visNetwork: {
    width: '100%',
    backgroundColor: 'transparent',
    height: '100%',
  },
}); 