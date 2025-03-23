import React, { Dispatch, SetStateAction, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface TextEditorProps {
    content: string;
    setContent: Dispatch<SetStateAction<string>>
}

const TextEditor: React.FC<TextEditorProps> = ({ content, setContent }) => {
    return (
        <Editor
            apiKey='t33s8i6kg8ziy8jybnguavyz02tdb9gwx33ptbir8v6qf867'
            id='TinyMCE'
            init={{
                width: 500,
                height: 500,
                // plugins: [
                //     // Core editing features
                //     'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                //     // Your account includes a free trial of TinyMCE premium features
                //     // Try the most popular premium features until Jan 11, 2025:
                //     'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                // ],import TextEditor from './TextEditor';

                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
                mergetags_list: [
                    { value: 'First.Name', title: 'First Name' },
                    { value: 'Email', title: 'Email' },
                ],
            }}
            initialValue={content}
            onEditorChange={(value) => setContent(value)}
        />
    )
}

export default TextEditor