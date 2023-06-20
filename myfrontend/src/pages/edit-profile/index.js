import React, { useState, useEffect } from 'react'
import './styles.css'
import Menu from '../../components/menu'
import Header from '../../components/header'
import HeaderDesktop from "../../components/headerDesktop";
import ImageUpload from '../../components/ImageUpload';

import api from '../../api';

import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate()

    const [selectedFile, setSelectedFile] = useState(null);

    const [user, setUser] = useState({
        full_name: '',
        nickname: '',
        bio_text: ''
    });

    useEffect(() => {
        let id = localStorage.getItem('idUser')

        id = id.substring(1, id.length - 1)

        const fetchUser = async () => {
            try {
                const response = await api.get(`/usuarios/${id}/`);

                setUser({
                    full_name: response.data.full_name,
                    nickname: response.data.nickname,
                    bio_text: response.data.bio_text
                });

            } catch (error) {
                console.error('Erro ao carregar os dados do usuário:', error);
            }
        };
        fetchUser();
    }, [])

    const handleSaveChanges = () => {
        let id = localStorage.getItem('idUser')

        id = id.substring(1, id.length - 1)

        if (!user.full_name || !user.nickname || !user.bio_text) {
            alert("Por favor, preencha todos os campos");
            return;
        }

        api.patch(`/usuarios/${id}/`, user)
            .then(response => {
                console.log('Dados do usuário atualizados com sucesso:', response.data);
                navigate('/profile')
            })
            .catch(error => {
                console.error('Erro ao atualizar os dados do usuário:', error);
            });
    };

    return (
        <>
            {(window.innerWidth > 760) ?
                <HeaderDesktop />
                :

                <Header />
            }
            <div className="content-all">
                <div className="left-content">
                    <Menu />
                </div>
                <div className="content-box-profile">
                    <div className='content-edit-space'>
                        <h2>Editar Perfil</h2>
                        
                        <div className="conf-profile">
                            <div className='row'>
                                <p>Seu nome</p>
                                <input maxLength={240} placeholder={user.full_name} id='name' className="content-input-edit" value={user.full_name} onChange={(event) => setUser({ ...user, full_name: event.target.value })} />
                            </div>
                            <div className='row'>
                                <p>Seu username</p>
                                <input maxLength={55} placeholder={user.nickname} id='username' className="content-input-edit" value={user.nickname} onChange={(event) => setUser({ ...user, nickname: event.target.value })} />
                            </div>
                            <div className='row'>
                                <p>Sobre você</p>
                                <textarea maxLength={220} placeholder={user.bio_text} id="w3review" rows="4" cols="50" className="content-input-edit" value={user.bio_text} onChange={(event) => setUser({ ...user, bio_text: event.target.value })}> </textarea>
                            </div>
                            <div className='row image-field'>
                                <div className='image-block'>
                                    <p>Alterar Avatar</p>
                                    {!selectedFile && (<img className="image-user" alt='image-user' src={user.profile_image ? user.profile_image : "https://i.imgur.com/piVx6dg.png"} style={{ objectFit: "cover" }} />)}
                                </div>

                                <ImageUpload
                                    selectedFile={selectedFile}
                                    setSelectedFile={setSelectedFile}
                                />
                            </div>
                        </div>
                        <button className='button-simple' onClick={handleSaveChanges}><p>Concluir alterações</p></button>
                    </div>
                </div>
                <div className="right-content">

                </div>
            </div>
        </>
    )
}

export default EditProfile;