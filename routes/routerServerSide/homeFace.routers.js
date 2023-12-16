var express = require('express');
var router = express.Router();
const authJwt =require("../../middleware/authJwt")
const controlNewAdmin = require("../../controllers/news.controller");
const controlTopicAdmin = require("../../controllers/topics.controller");
const controlEvaluateAdmin = require("../../controllers/evaluate.controller");

///giao diện faceweb

router.get('/interFaceWeb/homeFace', async (req, res) => {
    try {
      const topicData = await controlTopicAdmin.findbyQueryTopicFace(req, res);
      const newSlideData = await controlNewAdmin.findbyQueryNewSlide(req, res);
      //Laws
      const newLawsData = await controlNewAdmin.findbyQueryNewLaws(req, res);
      const newLawsBottomData = await controlNewAdmin.findbyQueryNewLawsBottom(req, res);
      const newLawsBottomLeftData = await controlNewAdmin.findbyQueryNewLawsBottomLeft(req, res);
      //Society
      const newSocietyBottomData = await controlNewAdmin.findbyQuerySocietyBottom(req, res);
      const newSocietyBottomLeftData = await controlNewAdmin.findbyQuerySocietyBottomLeft(req, res);
      //Economy
      const newEconomyData = await controlNewAdmin.findbyQueryNewEconomy(req, res);
      const newEconomyDataBottom = await controlNewAdmin.findbyQueryEconomyBottom(req, res);
      const newEconomyDataBottomLeft = await controlNewAdmin.findbyQueryEconomyBottomLeft(req, res);
      //Life & style
      const newLifeStyleData = await controlNewAdmin.findbyQueryLifeStyle(req, res);
      //sports
      const newSportData = await controlNewAdmin.findbyQuerySport(req, res);
      //Environment
      const newEnvironmentData = await controlNewAdmin.findbyQueryEnvironment(req, res);
      //newview
      const HotLuotXemData = await controlNewAdmin.findbyQueryNewViews(req, res);


      // console.log(newSlideData);
      res.render('interFaceWeb/homeFace.ejs', { topicData: topicData, newSlideData: newSlideData, newLawsData: newLawsData
      , newEconomyData: newEconomyData, newLawsBottomData: newLawsBottomData, newLawsBottomLeftData: newLawsBottomLeftData,
      newSocietyBottomData: newSocietyBottomData, newSocietyBottomLeftData: newSocietyBottomLeftData,
      newEconomyDataBottom: newEconomyDataBottom, newEconomyDataBottomLeft: newEconomyDataBottomLeft,
      newLifeStyleData: newLifeStyleData, newSportData: newSportData, newEnvironmentData: newEnvironmentData,
      HotLuotXemData: HotLuotXemData
    });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Internal server error.',
      });
    }
});
///chuyển trang
router.get('/interFaceWeb/topicFace/:id?', async (req, res) => {
  try {
    const id = req.params.id;
    const topicDataAndNew = await controlTopicAdmin.findOneTopic(id);
    const topicData = await controlTopicAdmin.findbyQueryTopicFace(req, res);
   

    res.render('interFaceWeb/topicFace.ejs', { topicDataAndNew: topicDataAndNew, topicData: topicData });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message || 'Internal server error.',
    });
  }
});

//chuyển trang chi tiết
router.get('/interFaceWeb/newDetail/:id?', async (req, res) => {
  try {
    let newDetailData, topicData, newGenreData; // Khai báo biến newGenreData

    if (req.params.id) {
      newDetailData = await controlNewAdmin.findNewByIdDetails(req.params.id);
    }
    
    topicData = await controlTopicAdmin.findbyQueryTopicFace(req, res);
    // newGenreData = await controlNewAdmin.findGenreAll(req, res);
     const topicNewData = await controlNewAdmin.findAllByPageNewTopic(req, res);

    res.render('interFaceWeb/newDetail.ejs', { newDetailData, topicData, newGenreData, topicNewData:topicNewData });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message || 'Internal server error.',
    });
  }
});

router.post('/interFaceWeb/newDetail/:id?', async (req, res) => {
  try {
    const data = await controlEvaluateAdmin.createEvaluateNews(req, res);
    // Thực hiện xử lý điều hướng hoặc phản hồi tại trang hiện tại

    res.send('<script>alert("Evaluate created successfully."); window.history.back();</script>');
    
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while creating the evaluate."
    });
  }
});
///chuyển trang search




module.exports = router;