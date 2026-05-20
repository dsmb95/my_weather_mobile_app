import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TITLE_KEY  = 'note_title';
const BODY_KEY = 'note_body'

export default function Notes () {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [savedTitle, setSavedTitle] = useState('');
    const [savedBody, setSavedBody] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadNotes();
    },[])

    const loadNotes = async() => {
        try {
            const title = await AsyncStorage.getItem(TITLE_KEY);
            const body = await AsyncStorage.getItem(BODY_KEY);

            if (title !== null) {
                setSavedTitle(title);
            }
            if (body !== null) {
                setSavedBody(body);
            }
        } catch(err) {
            setError(err.message);
        }
    }

    const handleSave = async() => {
        try {
            AsyncStorage.setItem(TITLE_KEY, title);
            AsyncStorage.setItem(BODY_KEY, body);
            
            setSavedTitle(title);
            setSavedBody(body);
        } catch(err) {
            setError(err.message);
        }
    }

    if (error) return <Text>Error: {error}</Text>
    
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text>Place your notes for the weather today.</Text>
                <TextInput
                value={title} 
                onChangeText={setTitle}
                placeholder="Title"
                style={styles.inputTitle}
                />
                <TextInput
                value={body} 
                onChangeText={setBody}
                placeholder="Notes"
                style={styles.inputBody}
                />
                <TouchableOpacity onPress={handleSave} style={styles.save}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>
            
            {savedTitle && (
                <View style={styles.notesContainer}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>Title: {savedTitle}</Text>
                    <Text style={{ fontSize: 15, textAlign: 'center'}}>{savedBody}</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    inputTitle: {
        width: 90,
        height: 40,
        borderWidth: 1,
        borderRadius: 10, 
        padding: 10, 
        marginTop:10
    },
    inputBody: {
        width: 260,
        height: 50,
        borderWidth: 1,
        borderRadius: 10, 
        padding: 10, 
        marginTop:10
    },
    save: {
        backgroundColor: 'rgb(112, 128, 144)',
        color: 'white',
        borderRadius: 10,
        padding: 10,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    saveText: {
        color: 'white',
        fontWeight: 'bold',
    },
    notesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(112, 128, 144)',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        width: 300,
        height: 260,
        gap: 16,
    }
})