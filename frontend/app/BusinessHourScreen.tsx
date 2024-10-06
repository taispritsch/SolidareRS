import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, IconButton, Switch, TextInput } from 'react-native-paper';
import { styles } from "./styles";
import { Colors } from '../constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import axiosInstance from '@/services/axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const PlaceForm = () => {
    const donationPlaceId = useLocalSearchParams().donationPlaceId;

    const [changeTimeValue, setChangeTimeValue] = useState(new Date());

    const [changeTime, setChangeTime] = useState(false);
    const [type, setType] = useState<'donation' | 'volunteer'>('donation');
    const [tempIndex, setTempIndex] = useState(0);
    const [tempHourIndex, setTempHourIndex] = useState(0);
    const [tempType, setTempType] = useState<'start' | 'end'>('end');

    const [volunteerSameAsDonation, setVolunteerSameAsDonation] = useState(false);

    const [loading, setLoading] = useState(false);
    interface BusinessHourDonation {
        day_of_week: string;
        type: string;
        hours: { start: string; end: string }[];
    }

    interface BusinessHourVolunteer {
        day_of_week: string;
        type: string;
        hours: { start: string; end: string }[];
    }

    const [businessHourDonation, setBusinessHourDonation] = useState<BusinessHourDonation[]>([]);
    const [businessHourVolunteer, setBusinessHourVolunteer] = useState<BusinessHourVolunteer[]>([]);

    const [showHoursDonation, setShowHoursDonation] = useState<boolean[]>([false]);
    const [showHoursVolunteer, setShowHoursVolunteer] = useState<boolean[]>([false]);


    const getBusinessHours = async () => {
        setLoading(true);

        try {
            const response = await axiosInstance.get(`donation-places/${donationPlaceId}/business-hours`);

            if (response.data.donation) {
                setBusinessHourDonation(response.data.donation);
            }

            if (response.data.volunteer) {
                setBusinessHourVolunteer(response.data.volunteer);
            }

        } catch (error: any) {
            console.error('Erro ao enviar a requisição:', error.response.data);
            Alert.alert('Erro', error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect((): void => {
        getBusinessHours();

    }, []);


    const handleSubmit = async () => {
        setLoading(true);

        try {
            await axiosInstance.put(`donation-places/${donationPlaceId}/business-hours`, {
                donation: businessHourDonation,
                volunteer: volunteerSameAsDonation ? businessHourDonation : businessHourVolunteer,
            });

            Alert.alert('Sucesso', 'Horários atualizados com sucesso!');

        } catch (error: any) {
            console.error('Erro ao enviar a requisição:', error.response.data);
            Alert.alert('Erro', error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const openTimePicker = (donation: boolean = true, time: string, hourIndex: number, index: number, type: 'start' | 'end' = 'end') => {
        const [hours, minutes] = time.split(':').map(Number);

        setChangeTimeValue(new Date(0, 0, 0, hours, minutes));

        setChangeTime(true);

        setTempIndex(index);
        setTempHourIndex(hourIndex);

        setTempType(type);

        setType(donation ? 'donation' : 'volunteer');
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={style.title}>
                    Horários de Funcionamento
                </Text>
                <ScrollView>
                    <View style={style.form}>
                        <View >
                            {businessHourDonation && businessHourDonation.length > 0 && (
                                <View style={style.block}>
                                    <Text style={style.title}>Doações</Text>
                                </View>
                            )}
                        </View>
                        <View >
                            {businessHourDonation && businessHourDonation.map((businessHourDonation, indexDonation) => (
                                <View key={indexDonation}>
                                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 14, fontWeight: 500 }}>{businessHourDonation.day_of_week}</Text>
                                        <IconButton
                                            icon={showHoursDonation[indexDonation] ? 'chevron-up' : 'chevron-down'}
                                            onPress={() => {
                                                setShowHoursDonation(prevState => {
                                                    const newShowHours = [...prevState];
                                                    newShowHours[indexDonation] = !newShowHours[indexDonation];
                                                    return newShowHours;
                                                });
                                            }}
                                        />
                                    </View>
                                    <View style={{ display: showHoursDonation[indexDonation] ? 'flex' : 'none' }}>
                                        {businessHourDonation.hours.map((hourDonation, hourIndexDonation) => (
                                            <View>
                                                {hourIndexDonation === 0 && (
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: 14, fontWeight: 500, width: '55%' }}>Início</Text>
                                                        <Text style={{ fontSize: 14, fontWeight: 500 }}>Fim</Text>
                                                    </View>
                                                )}
                                                <View key={hourIndexDonation} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                                    <Button
                                                        mode="outlined"
                                                        style={{ width: '45%' }}
                                                        contentStyle={{ height: 40, borderColor: '#585555' }}
                                                        textColor='#0041A3'
                                                        onPress={() => {
                                                            openTimePicker(true, hourDonation.start, hourIndexDonation, indexDonation, 'start');
                                                        }}
                                                    >
                                                        {hourDonation.start}
                                                    </Button>
                                                    <Button
                                                        mode="outlined"
                                                        style={{ width: '45%', borderColor: '#585555' }}
                                                        contentStyle={{ height: 40 }}
                                                        textColor='#0041A3'
                                                        onPress={() => {
                                                            openTimePicker(true, hourDonation.end, hourIndexDonation, indexDonation);
                                                        }}
                                                    >
                                                        {hourDonation.end}
                                                    </Button>
                                                </View>
                                            </View>
                                        ))}
                                        <View key={indexDonation} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Button
                                                mode="outlined"
                                                textColor='#0041A3'
                                                onPress={() => {
                                                    if (businessHourDonation.hours.length >= 3) {
                                                        return;
                                                    } else {
                                                        setBusinessHourDonation((prevState) => {
                                                            const newBusinessHours = [...prevState];
                                                            newBusinessHours[indexDonation].hours.push({ start: '00:00', end: '00:00' });
                                                            return newBusinessHours;
                                                        });
                                                    }
                                                }}
                                                icon={'plus'}
                                                style={{ width: '45%', borderColor: businessHourDonation.hours.length >= 3 ? '#d2d2d2' : '#0041A3' }}
                                                disabled={businessHourDonation.hours.length >= 3}
                                                contentStyle={{ height: 40 }}
                                            >
                                                Adicionar
                                            </Button>

                                            <Button
                                                mode="outlined"
                                                textColor='#0041A3'
                                                onPress={() => {
                                                    if (businessHourDonation.hours.length <= 0) {
                                                        return;
                                                    } else {
                                                        setBusinessHourDonation((prevState) => {
                                                            const newBusinessHours = [...prevState];
                                                            newBusinessHours[indexDonation].hours.pop();
                                                            return newBusinessHours;
                                                        });
                                                    }
                                                }}
                                                disabled={businessHourDonation.hours.length <= 0}
                                                icon={'minus'}
                                                style={{ width: '45%', borderColor: businessHourDonation.hours.length <= 0 ? '#d2d2d2' : '#0041A3' }}
                                                contentStyle={{ height: 40 }}
                                            >
                                                Remover
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {businessHourVolunteer && businessHourVolunteer.length > 0 && (
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 30 }}>
                            <Text style={{ fontSize: 14, fontWeight: 600 }}>
                                Utilizar os mesmos horários para voluntários
                            </Text>
                            <Switch
                                value={volunteerSameAsDonation}
                                onValueChange={() => setVolunteerSameAsDonation(!volunteerSameAsDonation)}
                                color={Colors.backgroundButton}
                            />
                        </View>
                    )}

                    {!volunteerSameAsDonation && (
                        <View style={style.form}>
                            <View >
                                {businessHourVolunteer && businessHourVolunteer.length > 0 && (
                                    <View style={style.block}>
                                        <Text style={style.title}>Voluntários</Text>
                                    </View>
                                )}
                            </View>
                            <View>
                                {businessHourVolunteer && businessHourVolunteer.map((businessHourVolunteer, indexVolunteer) => (
                                    <View key={indexVolunteer}>
                                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 14, fontWeight: 500 }}>{businessHourVolunteer.day_of_week}</Text>
                                            <IconButton
                                                icon={showHoursVolunteer[indexVolunteer] ? 'chevron-up' : 'chevron-down'}
                                                onPress={() => {
                                                    setShowHoursVolunteer(prevState => {
                                                        const newShowHours = [...prevState];
                                                        newShowHours[indexVolunteer] = !newShowHours[indexVolunteer];
                                                        return newShowHours;
                                                    });
                                                }}
                                            />
                                        </View>
                                        <View style={{ display: showHoursVolunteer[indexVolunteer] ? 'flex' : 'none' }}>
                                            {businessHourVolunteer.hours.map((hourVolunteer, hourIndexVolunteer) => (
                                                <View>
                                                    {hourIndexVolunteer === 0 && (
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ fontSize: 14, fontWeight: 500, width: '55%' }}>Início</Text>
                                                            <Text style={{ fontSize: 14, fontWeight: 500 }}>Fim</Text>
                                                        </View>
                                                    )}
                                                    <View key={hourIndexVolunteer} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                                        <Button
                                                            mode="outlined"
                                                            style={{ width: '45%' }}
                                                            contentStyle={{ height: 40, borderColor: '#585555' }}
                                                            textColor='#0041A3'
                                                            onPress={() => {
                                                                openTimePicker(false, hourVolunteer.start, hourIndexVolunteer, indexVolunteer, 'start');
                                                            }}
                                                        >
                                                            {hourVolunteer.start}
                                                        </Button>
                                                        <Button
                                                            mode="outlined"
                                                            style={{ width: '45%', borderColor: '#585555' }}
                                                            contentStyle={{ height: 40 }}
                                                            textColor='#0041A3'
                                                            onPress={() => {
                                                                openTimePicker(false, hourVolunteer.end, hourIndexVolunteer, indexVolunteer);
                                                            }
                                                            }
                                                        >
                                                            {hourVolunteer.end}
                                                        </Button>
                                                    </View>
                                                </View>
                                            ))}
                                            <View key={indexVolunteer} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Button
                                                    mode="outlined"
                                                    textColor='#0041A3'
                                                    onPress={() => {
                                                        if (businessHourVolunteer.hours.length >= 3) {
                                                            return;
                                                        } else {
                                                            setBusinessHourVolunteer((prevState) => {
                                                                const newBusinessHours = [...prevState];
                                                                newBusinessHours[indexVolunteer].hours.push({ start: '00:00', end: '00:00' });
                                                                return newBusinessHours;
                                                            });
                                                        }
                                                    }}
                                                    icon={'plus'}
                                                    style={{ width: '45%', borderColor: businessHourVolunteer.hours.length >= 3 ? '#d2d2d2' : '#0041A3' }}
                                                    disabled={businessHourVolunteer.hours.length >= 3}
                                                    contentStyle={{ height: 40 }}

                                                >
                                                    Adicionar
                                                </Button>

                                                <Button
                                                    mode="outlined"
                                                    textColor='#0041A3'
                                                    onPress={() => {
                                                        if (businessHourVolunteer.hours.length <= 0) {
                                                            return;
                                                        } else {
                                                            setBusinessHourVolunteer((prevState) => {
                                                                const newBusinessHours = [...prevState];
                                                                newBusinessHours[indexVolunteer].hours.pop();
                                                                return newBusinessHours;
                                                            });
                                                        }
                                                    }}
                                                    disabled={businessHourVolunteer.hours.length <= 0}
                                                    icon={'minus'}
                                                    style={{ width: '45%', borderColor: businessHourVolunteer.hours.length <= 0 ? '#d2d2d2' : '#0041A3' }}
                                                    contentStyle={{ height: 40 }}
                                                >
                                                    Remover
                                                </Button>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                    {changeTime && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <DateTimePicker
                                value={changeTimeValue}
                                mode="time"
                                timeZoneName={'GMT-2'}
                                is24Hour={true}
                                display="clock"
                                onChange={(event, selectedDate) => {
                                    setChangeTime(false);
                                    if (selectedDate) {
                                        const hours = selectedDate.getHours();
                                        const minutes = selectedDate.getMinutes();
                                        const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

                                        if (type === 'donation') {
                                            setBusinessHourDonation((prevState) => {
                                                const newBusinessHours = [...prevState];
                                                newBusinessHours[tempIndex].hours[tempHourIndex][tempType] = time;
                                                return newBusinessHours;
                                            });
                                        } else {
                                            setBusinessHourVolunteer((prevState) => {
                                                const newBusinessHours = [...prevState];
                                                newBusinessHours[tempIndex].hours[tempHourIndex][tempType] = time;
                                                return newBusinessHours;
                                            });
                                        }
                                    }
                                }}
                            />
                        </View>
                    )}
                </ScrollView>
                <View style={[style.button, { marginTop: 20 }]}>
                    <Button
                        mode="contained"
                        buttonColor={Colors.backgroundButton}
                        onPress={handleSubmit}
                        contentStyle={{ height: 50 }}
                        loading={loading}
                        disabled={loading}
                    >
                        Salvar
                    </Button>
                </View>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    title: {
        fontWeight: '700',
        fontSize: 24,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingHorizontal: 20,
    },
    textInput: {
        flex: 1
    },
    block: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        marginBottom: 40,
    }
});

export default PlaceForm;
