import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.scss'

export default function index({ value, setValue, name, disable = false }: { value: string, setValue: any, name: string, disable?: boolean }) {

    return (
        <div className='my-2'>
            <h5>{name}</h5>
            <ReactQuill theme="snow" value={value} onChange={setValue} className='text-editor-custom' readOnly={disable} />
        </div>

    );
}