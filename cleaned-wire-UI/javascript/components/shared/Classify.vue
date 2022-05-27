<template>
  <div>
    <b-row class="ml-1 pb-3">
      {{ classificationChosen }}
    </b-row>
    <b-row>
      <b-btn class="ml-1" variant="secondary" @click="classify()"
        >Classify</b-btn
      >
    </b-row>
    <input
      :id="'classificationXml' + _uid"
      type="hidden"
      :value="itemToClassify.classification_xml"
    />
  </div>
</template>

<script>
export default {
  name: "Classify",
  data: function () {
    return {
      cmtGuidePath: this.getHTML(),
      selectedFavorite: {},
      marking_constraints: `
      <ACGInput xmlns="urn:us:gov:_temp_28:cmpo:acg:schema:ACGInput:2.0">
        <MarkingConstraint hideMarkings="true">
          <ExcludeMarkingList>
            <ExcludeMarking value="EL" type="SCIControls"/>
      <ExcludeMarking value="EL_EU" type="SCIControls"/>
      <ExcludeMarking value="EL_NK" type="SCIControls"/>
      <ExcludeMarking value="HCS_HTF" type="SCIControls"/>
      <ExcludeMarking value="HCS_O" />
      <ExcludeMarking value="HCS_O_TF" />
      <ExcludeMarking value="HCS_P_TF" />
      <ExcludeMarking value="KDK" type="SCIControls"/>
      <ExcludeMarking value="KDK_BLFH" type="SCIControls"/>
      <ExcludeMarking value="KDK_KAND" type="SCIControls"/>
      <ExcludeMarking value="KDK_IDIT" type="SCIControls"/>
      <ExcludeMarking value="OTHER" type="SCIControls"/>
      <ExcludeMarking value="OTHERTF" type="SCIControls"/>
      <ExcludeMarking value="COMPREASON" type="SCIControls"/>
      <ExcludeMarking value="RSV" type="SCIControls"/>
      <ExcludeMarking value="RSV_RTF" type="SCIControls"/>
      <ExcludeMarking value="SI_SITF" type="SCIControls"/>
      <ExcludeMarking value="SI_G_GTF" type="SCIControls"/>
      <ExcludeMarking value="SI_ECI" type="SCIControls"/>
      <ExcludeMarking value="SI_ECI_ECITF" type="SCIControls"/>
      <ExcludeMarking value="SAR" type="SCIControls"/>
      <ExcludeMarking value="SARCOMBO" type="DescriptiveMarkings"/>
      <ExcludeMarking value="SPECIALACCESSTF" type="SCIControls"/>

      <ExcludeMarking value="AIUO" type="DisseminationControls" groupSource="_temp_28"/>
      <ExcludeMarking value="_temp_28 INTERNAL USE ONLY" type="DisseminationControls" groupSource="_temp_28"/>

      <ExcludeMarking value="_temp_82" type="DisseminationControls"/>
      <ExcludeMarking value="_temp_83" type="DisseminationControls"/>
      <ExcludeMarking value="_temp_111" type="DisseminationControls"/>
      <ExcludeMarking value="FRD_CNWDI" type="DisseminationControls"/>
      <ExcludeMarking value="FRD_SIGMA" type="DisseminationControls"/>
      <ExcludeMarking value="FRD_SIGMA_SIGMATF" type="DisseminationControls"/>
      <ExcludeMarking value="NODIS" type="DisseminationControls"/>
      <ExcludeMarking value="_temp_209" type="DisseminationControls"/>
      <ExcludeMarking value="RD_CNWDI" type="DisseminationControls"/>
      <ExcludeMarking value="RD_SIGMA" type="DisseminationControls"/>
      <ExcludeMarking value="RD_SIGMA_SIGMATF" type="DisseminationControls"/>
      <ExcludeMarking value="_temp_255" type="DisseminationControls"/>
      <ExcludeMarking value="TFNI" type="DisseminationControls"/>

      <ExcludeMarking value="ATTORNEY WORK PRODUCT" type="DescriptiveMarkings" groupSource="_temp_28"/>
      <ExcludeMarking value="ATTORNEY-CLIENT PRIVILEGED INFORMATION" type="DescriptiveMarkings" groupSource="_temp_28"/>
      <ExcludeMarking value="DELIBERATIVE PROCESS PRIVILEGED DOCUMENT" type="DescriptiveMarkings" groupSource="_temp_28"/>
      <ExcludeMarking value="SOURCE SELECTION SENSITIVE" type="DescriptiveMarkings" groupSource="_temp_28"/>

      <ExcludeMarking value="NATO Markings" />
      <ExcludeMarking value="NON-US-COUNTRY Markings" />
      <ExcludeMarking value="NATO NAC Markings" />
      <ExcludeMarking value="NON-US CLASSIFICATION"/>
      <ExcludeMarking value="NATO UNCLASSIFIED"/>
      <ExcludeMarking value="NATO RESTRICTED"/>
      <ExcludeMarking value="NATO _temp_50"/>
      <ExcludeMarking value="NATO _temp_249"/>
      <ExcludeMarking value="_temp_55 TOP _temp_249"/>
      <ExcludeMarking value="NON-US"/>
      <ExcludeMarking value="ATOMAL" />
      <ExcludeMarking value="BALK" />
      <ExcludeMarking value="BOHEMIA" />
          </ExcludeMarkingList>
        </MarkingConstraint>
      </ACGInput>
      `,
    };
  },
  computed: {
    rules() {
      let rules = this.classificationRules;
      if (this.required) {
        rules.unshift((v) => {
          let acceptedPlaceholders = ["Please classify...", "Current: "];
          let test = acceptedPlaceholders.includes(v) ? "" : v;
          return !!test || "You must classify this item.";
        });
      }
      return rules;
    },
    classificationChosen() {
      if (this.itemToClassify.classification_string) {
        return this.itemToClassify.classification_string;
      } else {
        return "Please Choose Classification";
      }
    },
    classifiedBy() {
      if (this.ain) {
        return this.ain;
      } else if (this.dn) {
        return this.dn;
      } else {
        console.error('Missing one of either required prop: "ain" or "dn"');
        return null;
      }
    },
    allFavorites() {
      let defaults = [
        {
          name: "UNCLASSIFIED",
          classification_string: "UNCLASSIFIED",
          classification_xml: this.buildDefaultFavoriteXml("UNCLASSIFIED"),
        },
        {
          name: "FOUO",
          classification_string: "UNCLASSIFIED//FOUO",
          classification_xml: this.buildDefaultFavoriteXml(
            "UNCLASSIFIED",
            "FOUO"
          ),
        },
        {
          name: "AIUO",
          classification_string: "UNCLASSIFIED//AIUO",
          classification_xml: this.buildDefaultFavoriteXml(
            "UNCLASSIFIED",
            "AIUO"
          ),
        },
      ];
      return this.classificationFavorites.concat(defaults);
    },
  },
  watch: {
    itemToClassify() {
      if (
        this.itemToClassify.classification == "" &&
        this.itemToClassify.classification_xml == ""
      ) {
        this.selectedFavorite = {};
      }
    },

    selectedFavorite() {
      this.$emit("classification-changed");
    },
  },
  methods: {
    getHTML() {
      return require("../../assets/acg-popup.html");
    },
    classify() {
      classification.setClassifiedBy(this.classifiedBy);
      classification.setFavoritesXML(this.getFavoritesXml());

      let classificationXML = document.getElementById(
        "classificationXml" + this._uid
      ).value;
      if (classificationXML.length > 0) {
        classification.setClassificationXML(classificationXML);
      } else {
        classification.clear();
      }

      input.setInputXML(this.marking_constraints);

      if (this.portionMark) {
        launchAcgPortionMarkingWindow(this.cmtGuidePath.default);
      } else {
        launchAcgWindow(this.cmtGuidePath.default);
      }

      document.addEventListener(
        "classification_updated",
        this.updateClassification
      );
    },
    buildDefaultFavoriteXml(classification, control = "") {
      let source = "";
      switch (control) {
        case "FOUO":
          source = "DOD";
          break;
        default:
          break;
      }

      let banner =
        control == "" ? classification : classification + "//" + control;

      return `<class:Classification xmlns:class="urn:us:gov:_temp_28:enterprise:schema:Classification:2.3"
                                      xmlns="http://www.w3.org/1999/xhtml"
                                      dateClassified="${moment().format(
                                        "YYYY-MM-DD"
                                      )}"
                                      portionMarking="false" caveat="false" tool="DHTML" toolVersion="201910">
                 <class:ClassificationMarking type="USClassificationMarking" value="${classification}"/>
                 <class:ClassifiedBy>${this.classifiedBy}</class:ClassifiedBy>
                 <class:ClassificationHeader>
                   <class:ClassificationBanner>${banner}</class:ClassificationBanner>
                   <class:SCICaveat></class:SCICaveat>
                   <class:DescriptiveMarkings></class:DescriptiveMarkings>
                 </class:ClassificationHeader>
                 <class:ControlMarkings type="DisseminationControls">
                   <class:ControlMarking value="${control}" groupSource="${source}"></class:ControlMarking>
                 </class:ControlMarkings>
                 <class:ClassificationFooter>
                   <class:ClassificationBanner>${banner}</class:ClassificationBanner>
                 </class:ClassificationFooter>
               </class:Classification>`;
    },
    getFavoritesXml() {
      let favorites = this.classificationFavorites.map((favorite) => {
        return (
          "<Favorite name='" +
          favorite.name +
          "'>" +
          favorite.classification_xml +
          "</Favorite>"
        );
      });

      let favoritesXml =
        '<ClassificationFavorites xmlns="http://www.w3.org/1999/xhtml">' +
        "<User>" +
        this.classifiedBy +
        "</User>" +
        favorites.join("") +
        "</ClassificationFavorites>";

      return favoritesXml;
    },

    updateClassification(evt) {
      let prevClassification = this.itemToClassify.classification_string;
      this.itemToClassify.classification_xml = evt.detail.xml;
      this.itemToClassify.classification_string = classification
        .getHeader()
        .getBanner();

      if (
        classification.getFavorites().length >
        this.classificationFavorites.length
      ) {
        let newFavorite = classification.getFavorites().slice(-1)[0];
        let favoriteXml = classification.getFavorite(newFavorite);
        let parsedXml = new DOMParser().parseFromString(
          favoriteXml,
          "text/xml"
        );
        let banner = parsedXml.getElementsByTagName(
          "class:ClassificationBanner"
        )[0].childNodes[0].nodeValue;
        this.$emit("new-classification-favorite", {
          name: newFavorite,
          classification_xml: favoriteXml,
          classification_string: banner,
        });
      }

      if (prevClassification !== this.itemToClassify.classification_string) {
        this.selectedFavorite = {};
      }
      document.removeEventListener(
        "classification_updated",
        this.updateClassification
      );
    },

    userSelectedFavorite(event) {
      userSelectedFavorite(this.selectedFavorite, null, true);
      this.itemToClassify.classification_string = this.selectedFavorite.classification_string;
      this.itemToClassify.classification_xml = this.selectedFavorite.classification_xml;
    },
  },

  props: {
    itemToClassify: {
      type: Object,
      required: true,
    },
    ain: {
      type: String,
      required: false,
    },
    dn: {
      type: String,
      required: false,
    },
    classificationFavorites: {
      type: Array,
      required: true,
    },
    classificationRules: {
      type: Array,
      default: function () {
        return [];
      },
    },
    portionMark: Boolean,
    required: Boolean,
  },
};
</script>

<style>
div[id^="classificationForm"] {
  padding: 10px;
  margin-left: -10px;
  margin-right: -10px;
  width: 100%;
}

.classification-form {
  border: 2px solid black;
  border-radius: 5px;
}

input[id^="classificationDisplay"] {
  font-size: 14px;
  color: black !important;
}
</style>
