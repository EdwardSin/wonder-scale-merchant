import _ from 'lodash';

export class Tag {
  input = '';
  tags = [];
  max = 10;
  error = '';

  addTag(customTag?) {
    
    if(customTag && validateTag.bind(this)(customTag) && this.tags.length < this.max){
      this.tags.push(customTag);
      return;
    }
    
    if (validateTag.bind(this)(this.input)) {
      this.tags.push(this.input);
      this.input = '';
    }

    function validateTag(value) {
      if (!value || value.trim() === '') {
        this.error = 'Tag cannot be empty text.';
        return false;
      }
      else if (value.length > 20) {
        this.error = 'Tag cannot more than 20 characters.';
        return false;
      }
      else if (this.tags.some(x => x.trim().toLowerCase() === value.trim().toLowerCase())) {
        this.error = 'Tag is repeated.';
        return false
      }
      return true;
    }
  }
  removeTag(tag) {
    _.remove(this.tags, x => x == tag);
  }
  
  reset(){
    this.error = '';
  }
}