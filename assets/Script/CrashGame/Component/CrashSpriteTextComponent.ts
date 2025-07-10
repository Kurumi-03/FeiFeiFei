import { _decorator, CCInteger, CCString, Color, Component, Layout, math, Sprite, SpriteAtlas, UITransform } from 'cc';
import { CrashFontExt } from './CrashFontExt';
const { ccclass, property,executeInEditMode } = _decorator;


@ccclass('CrashSpriteTextComponent')
@executeInEditMode(true)
export class CrashSpriteTextComponent extends Component {
    @property({type:Color,serializable:true})
    color:Color=Color.WHITE;

    @property(String)
    text = '';

    @property(String)
    fontName = '';
    @property({
        type: [CrashFontExt]
    })
    expectedChars: CrashFontExt[] = [];

    sprites: Sprite[] = [];
    fontAtlas: SpriteAtlas = null;
    lastText: string ="";
    index: number=0;
    layout:Layout;
    contentSize:UITransform;
    width: number = 0;
    height: number = 0;
    start() {
        this.sprites =this.getComponentsInChildren(Sprite);
        this.layout = this.node.getComponent(Layout);
        this.contentSize = this.node.getComponent(UITransform);
        this.fontAtlas = this.sprites[0].spriteAtlas;
        
        this._updateText();
    }

    update(dt: number): void {
        // this.index++;
        // if(this.index==3)
        // {
        //     this.text = math.randomRange(0,999999999999).toString();
        //     this.index = 0;
        //     this.text = math.randomRange(9999990,99999999999).toString();
        // }
        this._updateText();
    }

    public setText(text: string) {
        this.text = text;
        this._updateText();
    }

    _updateText() {
        if (this.text == this.lastText) {
            return;
        }
        this.width = 0;
        this.height = 0;
        for (let i = 0; i < this.sprites.length; i++) {
            const sprite = this.sprites[i];
            var char = this.text[this.text.length-1-i];
            if(this.text.length > i&&char!=''){
                sprite.node.active = true;
                sprite.spriteFrame = this.fontAtlas.getSpriteFrame("Text/"+this.fontName+"-"+char);
                sprite.sizeMode = Sprite.SizeMode.TRIMMED;
                sprite.color = this.color;
                var posY = this.getCharPosY(char);
                sprite.node.position = new math.Vec3(sprite.node.position.x,posY,0);
                this.width = this.width + sprite.spriteFrame.rect.width+this.layout.spacingX;
                if(this.height<sprite.spriteFrame.rect.height)
                {
                    this.height = sprite.spriteFrame.rect.height;
                }
            }
            else
            {
                sprite.spriteFrame =null;
                sprite.node.active = false;
            } 
        }
        this.contentSize.setContentSize(this.width,this.height);
        this.lastText = this.text;
    }

    public setColor(color: Color) {
        this.color = color;
        for (let i = 0; i < this.sprites.length; i++) {
            const sprite = this.sprites[i];
            if(sprite.spriteFrame)
            {
                sprite.color = color;
            }
        }
    }

    getCharPosY(char: string) {
        for (let i = 0; i < this.expectedChars.length; i++) {
            if (this.expectedChars[i].char == char) {
                return this.expectedChars[i].offsetY;
            }
        }
        return 0;
    }
}



