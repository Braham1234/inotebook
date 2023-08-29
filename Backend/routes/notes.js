const express=require('express');
const {body, validationResult } = require('express-validator');
const router=express.Router();
const fetchuser=require('../middleware/fetchuser');
const Note=require('../models/Note');

//Route 1 : Get all notes using get "/api/notes/getuser"
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
        const notes=await Note.find({user:req.user.id});
        res.json(notes); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
      }
    
})
//Route 2 : Add a new note  using post "/api/auth/addnote".login required
router.post('/addnote',fetchuser, [
    body('title', 'Enter valid title').isLength({min:3}),
    body('description', 'Description must be atleast 5 characters').isLength({min:5}),],async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
        //if there are errors,return bad request and the errors
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const note=new Note({
            title,description,tag,user: req.user.id
        })
        const savedNote =await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
      }
    
})
//Route 3 : Update the existing note  using PUT "/api/auth/updatenote".login required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try {
        
    const {title,description,tag}=req.body;
    //Create a new note object
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};
    //find the note to be updated and update it
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
    res.json({note})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
      }
    })
//Route 4 : Delete the existing note  using DELETE "/api/auth/deletenode".login required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try {
        
    
    //find the note to be deleted and delete it
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    //Allow deletion only if user owns this Note 
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note=await Note.findByIdAndDelete(req.params.id);
    res.json({"Sucess ": "Note has been deleted", note: note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
      }
    })
    

module.exports=router