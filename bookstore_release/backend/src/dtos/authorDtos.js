class CreateAuthorDto{ constructor({name,bio}){ this.name=name; this.bio=bio; } }
class UpdateAuthorDto{ constructor(partial){ Object.assign(this, partial);} }
class AuthorDto{ constructor(row){ if(!row) return null; this.id=row.id; this.name=row.name; this.bio=row.bio; } }
module.exports={CreateAuthorDto,UpdateAuthorDto,AuthorDto};
